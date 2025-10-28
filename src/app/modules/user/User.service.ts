import { TList } from '../query/Query.interface';
import {
  userSearchableFields as searchFields,
  userOmit,
} from './User.constant';
import { prisma } from '../../../utils/db';
import { EUserRole, Prisma, User as TUser } from '../../../../prisma';
import { TPagination } from '../../../utils/server/serveResponse';
import { deleteFile } from '../../middlewares/capture';
import { TUpdateAvailability, TUpdateVenue, TUserEdit } from './User.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../auth/Auth.utils';
import { generateOTP } from '../../../utils/crypto/otp';
import { sendEmail } from '../../../utils/sendMail';
import { errorLogger } from '../../../utils/logger';
import { otp_send_template } from '../../../templates';
import config from '../../../config';

export const UserServices = {
  async register({ email, role, password, ...payload }: TUser) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `${existingUser.role} already exists with this ${email} email.`,
      );

    const user = await prisma.user.create({
      data: {
        email,
        role,
        password: await hashPassword(password),
        ...payload,
      },
      omit: userOmit[role],
    });

    try {
      const otp = generateOTP({
        tokenType: 'access_token',
        userId: user.id,
      });

      await sendEmail({
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

    return user;
  },

  async updateUser({ user, body }: { user: Partial<TUser>; body: TUserEdit }) {
    if (body.avatar && user.avatar) await deleteFile(user.avatar);

    return prisma.user.update({
      where: { id: user.id },
      omit: userOmit[body.role ?? user.role ?? EUserRole.USER],
      data: body,
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

  async updateVenue({ user_id, ...payload }: TUpdateVenue) {
    return prisma.user.update({
      where: { id: user_id },
      data: payload,
      select: { id: true },
    });
  },
};
