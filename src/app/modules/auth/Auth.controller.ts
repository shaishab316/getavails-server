import { AuthServices } from './Auth.service';
import catchAsync from '../../middlewares/catchAsync';
import { verifyPassword } from './Auth.utils';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { TToken } from '../../../types/auth.types';

export const AuthControllers = {
  login: catchAsync(async ({ body }, res) => {
    const user = await AuthServices.login(body);

    const { access_token, refresh_token } = AuthServices.retrieveToken(
      user!.id!,
      'access_token',
      'refresh_token',
    );

    AuthServices.setTokens(res, { access_token, refresh_token });

    return {
      message: 'Login successfully!',
      data: { access_token, refresh_token, user },
    };
  }),

  accountVerifyOtpSend: catchAsync(async ({ body }) => {
    await AuthServices.accountVerifyOtpSend(body);

    return {
      message: 'OTP sent successfully!',
    };
  }),

  accountVerify: catchAsync(async ({ body }, res) => {
    const user = await AuthServices.userOtpVerify(body);

    const { access_token, refresh_token } = AuthServices.retrieveToken(
      user.id!,
      'access_token',
      'refresh_token',
    );

    AuthServices.setTokens(res, { access_token, refresh_token });

    return {
      message: 'Account verified successfully!',
      data: { access_token, refresh_token, user },
    };
  }),

  forgotPasswordOtpVerify: catchAsync(async ({ body }, res) => {
    const user = await AuthServices.userOtpVerify({
      ...body,
      token_type: 'reset_token',
    });

    const { reset_token } = AuthServices.retrieveToken(user.id!, 'reset_token');

    AuthServices.setTokens(res, { reset_token });

    return {
      message: 'OTP verified successfully!',
      data: { reset_token, user },
    };
  }),

  forgotPassword: catchAsync(async ({ body }) => {
    await AuthServices.forgotPassword(body);

    return {
      message: 'OTP sent successfully!',
    };
  }),

  resetPassword: catchAsync(async ({ user, body }, res) => {
    const userData = await AuthServices.resetPassword(user, body);

    const { access_token, refresh_token } = AuthServices.retrieveToken(
      user.id,
      'access_token',
      'refresh_token',
    );

    AuthServices.setTokens(res, { access_token, refresh_token });
    AuthServices.destroyTokens(res, 'reset_token');

    return {
      message: 'Password reset successfully!',
      data: { access_token, refresh_token, user: userData },
    };
  }),

  changePassword: catchAsync(async ({ user, body }) => {
    if (!(await verifyPassword(body.oldPassword, user.password))) {
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'Incorrect password');
    }

    if (body.oldPassword === body.newPassword) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You cannot use old password',
      );
    }

    await AuthServices.modifyPassword({
      userId: user.id,
      password: body.newPassword,
    });

    return {
      message: 'Password changed successfully!',
    };
  }),

  logout: catchAsync(async ({ cookies }, res) => {
    AuthServices.destroyTokens(res, ...(Object.keys(cookies) as TToken[]));

    return {
      message: 'Logged out successfully!',
    };
  }),

  refreshToken: catchAsync(async ({ user }) => {
    const { access_token } = AuthServices.retrieveToken(
      user.id,
      'access_token',
    );

    return {
      message: 'AccessToken refreshed successfully!',
      data: { access_token },
    };
  }),
};
