import type { TList } from '../query/Query.interface';
import {
  userSearchableFields as searchFields,
  userOmit,
} from './User.constant';
import { EUserRole, Prisma, prisma, User as TUser } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { deleteFile } from '../../middlewares/capture';
import type { TUpdateAvailability, TUserEdit } from './User.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../auth/Auth.utils';
import { generateOTP } from '../../../utils/crypto/otp';
import emailQueue from '../../../utils/mq/emailQueue';
import { errorLogger } from '../../../utils/logger';
import { otp_send_template } from '../../../templates';
import config from '../../../config';

export const UserServices = {
  async getNextUserId(
    where:
      | { role: EUserRole; is_admin?: never }
      | { role?: never; is_admin: true },
  ): Promise<string> {
    const prefix = where.role ? where.role.toLowerCase().slice(0, 2) : 'su';

    const user = await prisma.user.findFirst({
      where,
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    if (!user) return `${prefix}-1`;

    const currSL = parseInt(user.id.split('-')[1], 10);
    return `${prefix}-${currSL + 1}`;
  },

  async register({ email, role, password, ...payload }: Omit<TUser, 'id'>) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { role: true }, //? select only role
    });

    if (existingUser)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `${existingUser.role} already exists with this ${email} email.`,
      );

    const user = await prisma.user.create({
      data: {
        id: await UserServices.getNextUserId({ role }),
        email,
        role,
        password: await hashPassword(password),
        ...payload,
      },
      omit: {
        ...userOmit[role],
        email: false,
        otp_id: false,
      },
    });

    try {
      const otp = generateOTP({
        tokenType: 'access_token',
        otpId: user.id + user.otp_id,
      });

      await emailQueue.add({
        to: user.email,
        subject: `Your ${config.server.name} Account Verification OTP is ⚡ ${otp} ⚡.`,
        html: otp_send_template({
          userName: user.name,
          otp,
          template: 'account_verify',
        }),
      });
    } catch (error) {
      if (error instanceof Error) errorLogger.error(error.message);
    }

    return {
      ...user,
      otp_id: undefined,
    };
  },

  async updateUser({ user, body }: { user: Partial<TUser>; body: TUserEdit }) {
    const data: Prisma.UserUpdateInput = body;

    if (body.avatar && user.avatar) await deleteFile(user.avatar);

    if (body.role && body.role !== user.role)
      data.id = await this.getNextUserId({ role: body.role });

    return prisma.user.update({
      where: { id: user.id },
      omit: userOmit[body.role ?? user.role ?? EUserRole.USER],
      data,
    });
  },

  async getAllUser({
    page,
    limit,
    search,
    omit,
    ...where
  }: Prisma.UserWhereInput & TList & { omit: Prisma.UserOmit }) {
    where ??= {} as any;

    if (search)
      where.OR = searchFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));

    const users = await prisma.user.findMany({
      where,
      omit,
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.user.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } as TPagination,
      },
      users,
    };
  },

  async getUserById({
    userId,
    omit = undefined,
  }: {
    userId: string;
    omit?: Prisma.UserOmit;
  }) {
    return prisma.user.findUnique({
      where: { id: userId },
      omit,
    });
  },

  async getUsersCount() {
    const counts = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        _all: true,
      },
    });

    return Object.fromEntries(
      counts.map(({ role, _count }) => [role, _count._all]),
    );
  },

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.avatar) await deleteFile(user.avatar);

    return prisma.user.delete({ where: { id: userId } });
  },

  async updateAvailability({ availability, user_id }: TUpdateAvailability) {
    return prisma.user.update({
      where: { id: user_id },
      data: {
        availability,
      },
      select: { id: true },
    });
  },
};
