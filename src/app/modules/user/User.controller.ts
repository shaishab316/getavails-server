import { UserServices } from './User.service';
import catchAsync from '../../middlewares/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from '../auth/Auth.service';
import { EUserRole, User as TUser } from '../../../../prisma';
import { prisma } from '../../../utils/db';
import { enum_decode } from '../../../utils/transform/enum';
import { capitalize } from '../../../utils/transform/capitalize';
import { generateOTP } from '../../../utils/crypto/otp';
import { sendEmail } from '../../../utils/sendMail';
import config from '../../../config';
import { otp_send_template } from '../../../templates';
import { errorLogger } from '../../../utils/logger';

export const UserControllers = {
  register: (role: EUserRole) =>
    catchAsync(async ({ body }, res) => {
      const user = await UserServices[
        `${role.toLowerCase()}Register` as `${Lowercase<EUserRole>}Register`
      ]({
        ...body,
        role,
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

      const { access_token, refresh_token } = AuthServices.retrieveToken(
        user.id,
        'access_token',
        'refresh_token',
      );

      AuthServices.setTokens(res, { access_token, refresh_token });

      return {
        statusCode: StatusCodes.CREATED,
        message: `${capitalize(user.role) ?? 'Unknown'} registered successfully!`,
        data: {
          access_token,
          refresh_token,
          user,
        },
      };
    }),

  editProfile: catchAsync(async req => {
    const data = await UserServices.updateUser(req);

    return {
      message: 'Profile updated successfully!',
      data,
    };
  }),

  superEditProfile: catchAsync(async ({ params, body }) => {
    const user = (await prisma.user.findUnique({
      where: { id: params.userId },
    })) as TUser;

    const data = await UserServices.updateUser({
      user,
      body,
    });

    return {
      message: `${capitalize(user?.role) ?? 'User'} updated successfully!`,
      data,
    };
  }),

  getAllUser: catchAsync(async ({ query }) => {
    const { meta, users } = await UserServices.getAllUser(query);

    return {
      message: 'Users retrieved successfully!',
      meta,
      data: users,
    };
  }),

  superGetAllUser: catchAsync(async ({ query }) => {
    const { meta, users } = await UserServices.getAllUser(query);

    Object.assign(meta, {
      users: await UserServices.getUsersCount(),
    });

    return {
      message: 'Users retrieved successfully!',
      meta,
      data: users,
    };
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  profile: catchAsync(({ user: { password: _, ...user } }) => {
    return {
      message: 'Profile retrieved successfully!',
      data: user,
    };
  }),

  superDeleteAccount: catchAsync(async ({ params }) => {
    const user = await UserServices.deleteAccount(params.userId);

    return {
      message: `${user?.name ?? 'User'} deleted successfully!`,
    };
  }),

  deleteAccount: catchAsync(async ({ user }) => {
    await UserServices.deleteAccount(user.id);

    return {
      message: `Goodbye ${user?.name ?? enum_decode(user.role)}! Your account has been deleted successfully!`,
    };
  }),

  updateAvailability: catchAsync(async ({ body, user }) => {
    await UserServices.updateAvailability({
      ...body,
      user_id: user.id,
    });

    return {
      message: 'Availability updated successfully!',
      data: body,
    };
  }),
};
