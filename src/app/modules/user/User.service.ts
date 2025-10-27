import { TList } from '../query/Query.interface';
import {
  userSearchableFields as searchFields,
  userAgentOmit,
  userArtistOmit,
  userDefaultOmit,
  userOrganizerOmit,
  userVenueOmit,
} from './User.constant';
import { prisma } from '../../../utils/db';
import { EUserRole, Prisma, User as TUser } from '../../../../prisma';
import { TPagination } from '../../../utils/server/serveResponse';
import { deleteFile } from '../../middlewares/capture';
import {
  TAgentRegister,
  TArtistRegister,
  TOrganizerRegister,
  TUserEdit,
  TUserRegister,
  TVenueRegister,
} from './User.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { errorLogger } from '../../../utils/logger';
import config from '../../../config';
import { otp_send_template } from '../../../templates';
import { sendEmail } from '../../../utils/sendMail';
import { hashPassword } from '../auth/Auth.utils';
import { generateOTP } from '../../../utils/crypto/otp';

export const UserServices = {
  async userRegister({ password, email }: TUserRegister) {
    //! check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `User already exists with this ${email} email`.trim(),
      );

    //! finally create user and in return omit auth fields
    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        role: EUserRole.USER,
      },
      omit: userDefaultOmit,
    });

    try {
      const otp = generateOTP({
        tokenType: 'access_token',
        userId: user.id,
      });

      if (email)
        await sendEmail({
          to: email,
          subject: `Your ${config.server.name} Account Verification OTP is ⚡ ${otp} ⚡.`,
          html: otp_send_template({
            userName: user.name,
            otp,
            template: 'account_verify',
          }),
        });
    } catch (error: any) {
      errorLogger.error(error.message);
    }

    return user;
  },

  async updateUser({ user, body }: { user: Partial<TUser>; body: TUserEdit }) {
    if (body.avatar && user?.avatar) await deleteFile(user.avatar);

    return prisma.user.update({
      where: { id: user.id },
      omit: userDefaultOmit,
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

  async agentRegister({ password, email, ...payload }: TAgentRegister) {
    const existingAgent = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAgent)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `Agent already exists with this ${email} email`.trim(),
      );

    return prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        role: EUserRole.AGENT,
        ...payload,
      },
      omit: userAgentOmit,
    });
  },

  async venueRegister({
    password,
    email,
    location,
    name,
    venue_capacity,
    venue_type,
  }: TVenueRegister) {
    const existingVenue = await prisma.user.findUnique({
      where: { email },
    });

    if (existingVenue)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `Venue already exists with this ${email} email`.trim(),
      );

    return prisma.$transaction(async tx => {
      const venue = await tx.user.create({
        data: {
          email,
          password: await hashPassword(password),
          role: EUserRole.VENUE,
          name,
          location,
        },
        omit: userVenueOmit,
      });

      await tx.venue.create({
        data: {
          id: venue.id,
          capacity: venue_capacity,
          venue_type,
          name,
          email,
          location,
        },
      });

      return venue;
    });
  },

  async artistRegister({ password, email, ...payload }: TArtistRegister) {
    const existingArtist = await prisma.user.findUnique({
      where: { email },
    });

    if (existingArtist)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `Artist already exists with this ${email} email`.trim(),
      );

    return prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        role: EUserRole.ARTIST,
        ...payload,
      },
      omit: userArtistOmit,
    });
  },

  async organizerRegister({
    email,
    password,
    name,
    location,
  }: TOrganizerRegister) {
    const existingOrganizer = await prisma.user.findUnique({
      where: { email },
    });

    if (existingOrganizer)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `Organizer already exists with this ${email} email`.trim(),
      );

    // TODO: implement organizer model

    return prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        role: EUserRole.ORGANIZER,
        name,
        location,
      },
      omit: userOrganizerOmit,
    });
  },
};
