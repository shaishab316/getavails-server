/* eslint-disable no-unused-vars */
import type {
  TAccountVerify,
  TAccountVerifyOtpSend,
  TResetPassword,
  TUserLogin,
} from './Auth.interface';
import { encodeToken, hashPassword, verifyPassword } from './Auth.utils';
import { prisma, User as TUser } from '../../../utils/db';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import emailQueue from '../../../utils/mq/emailQueue';
import { otp_send_template } from '../../../templates';
import { errorLogger } from '../../../utils/logger';
import ms from 'ms';
import { Response } from 'express';
import { generateOTP, validateOTP } from '../../../utils/crypto/otp';
import { userOmit } from '../user/User.constant';
import { TToken } from '../../../types/auth.types';

/**
 * Authentication services
 */
export const AuthServices = {
  /**
   * Login user using email and password
   */
  async login({ password, email }: TUserLogin) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        name: true,
        is_verified: true,
        role: true,
        otp_id: true,
      },
    });

    if (!user) {
      throw new ServerError(StatusCodes.NOT_FOUND, "User doesn't exist");
    }

    if (!(await verifyPassword(password, user.password))) {
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'Incorrect password');
    }

    //? if user is not verified then send otp again
    if (!user.is_verified) {
      const otp = generateOTP({
        tokenType: 'access_token',
        otpId: user.id + user.otp_id,
      });

      try {
        if (email)
          await emailQueue.add({
            to: email,
            subject: `Your ${config.server.name} Account Verification OTP is ⚡ ${otp} ⚡.`,
            html: otp_send_template({
              userName: user.name,
              otp,
              template: 'account_verify',
            }),
          });
      } catch (error) {
        if (error instanceof Error) {
          errorLogger.error(error.message);
        }
      }
    }

    return prisma.user.findUnique({
      where: { id: user.id },
      omit: userOmit[user.role],
    });
  },

  /**
   * this function sets tokens in cookies
   */
  setTokens(res: Response, tokens: { [key in TToken]?: string }) {
    return; // TODO: cookies disabled for testing

    Object.entries(tokens).forEach(([key, value]) =>
      res.cookie(key, value, {
        httpOnly: true,
        secure: !config.server.isDevelopment,
        maxAge: ms(config.jwt[key as TToken].expire_in),
      }),
    );
  },

  /**
   * this function deletes tokens from cookies
   */
  destroyTokens<T extends readonly TToken[]>(res: Response, ...cookies: T) {
    for (const cookie of cookies)
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: !config.server.isDevelopment,
        maxAge: 0, //? expire immediately
      });
  },

  /**
   * this function returns an object of tokens
   */
  retrieveToken<T extends readonly TToken[]>(uid: string, ...token_types: T) {
    return Object.fromEntries(
      token_types.map(token_type => [
        token_type,
        encodeToken({ uid }, token_type),
      ]),
    ) as Record<T[number], string>;
  },

  /**
   * this function sends otp to user
   */
  async accountVerifyOtpSend({ email }: TAccountVerifyOtpSend) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        is_verified: true,
        otp_id: true,
      },
    });

    if (!user)
      throw new ServerError(StatusCodes.NOT_FOUND, "User doesn't exist");

    if (user.is_verified)
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'Your account is already verified',
      );

    const otp = generateOTP({
      tokenType: 'access_token',
      otpId: user.id + user.otp_id,
    });

    await emailQueue.add({
      to: email,
      subject: `Your ${config.server.name} Account Verification OTP is ⚡ ${otp} ⚡.`,
      html: otp_send_template({
        userName: user.name,
        otp,
        template: 'account_verify',
      }),
    });
  },

  /**
   * this function sends otp to user
   */
  async forgotPassword({ email }: TAccountVerifyOtpSend) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        otp_id: true,
      },
    });

    if (!user)
      throw new ServerError(StatusCodes.NOT_FOUND, "User doesn't exist");

    const otp = generateOTP({
      tokenType: 'reset_token',
      otpId: user.id + user.otp_id,
    });

    await emailQueue.add({
      to: email,
      subject: `Your ${config.server.name} Password Reset OTP is ⚡ ${otp} ⚡.`,
      html: otp_send_template({
        userName: user.name,
        otp,
        template: 'reset_password',
      }),
    });
  },

  /**
   * this function verifies otp
   */
  async userOtpVerify({
    email,
    otp,
    token_type = 'access_token',
  }: TAccountVerify & { token_type: TToken }) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        otp_id: true,
      },
    });

    if (!user)
      throw new ServerError(StatusCodes.NOT_FOUND, "User doesn't exist");

    if (
      !validateOTP({
        otp,
        tokenType: token_type,
        otpId: user.id + user.otp_id,
      })
    )
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'Incorrect OTP');

    return prisma.user.update({
      where: { id: user.id },
      data: {
        otp_id: { increment: 1 }, //? unique otp every time

        is_verified: true,
        is_active: true, //TODO: account activation
      },
      omit: userOmit[user.role],
    });
  },

  /**
   * this function modifies password
   */
  async modifyPassword({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }) {
    await prisma.user.update({
      where: { id: userId },
      data: { password: await hashPassword(password) },
      select: { id: true }, //? skip body
    });
  },

  /**
   * this function resets password
   */
  async resetPassword(user: TUser, { password }: TResetPassword) {
    if (await verifyPassword(password, user.password)) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You cannot use old password',
      );
    }

    await this.modifyPassword({
      userId: user.id,
      password,
    });

    return prisma.user.findUnique({
      where: { id: user.id },
      omit: userOmit[user.role],
    });
  },
};
