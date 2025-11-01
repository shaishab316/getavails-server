import jwt from 'jsonwebtoken';
import config from '../../../config';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { errorLogger } from '../../../utils/logger';
import chalk from 'chalk';
import bcrypt from 'bcryptjs';
import { enum_decode } from '../../../utils/transform/enum';
import { TToken, TTokenPayload } from '../../../types/auth.types';
import rateLimit from 'express-rate-limit';
import ms from 'ms';

/**
 * Create a token
 * @param payload - The payload to sign
 * @param token_type - The type of token to create
 * @returns The signed token
 */
export const encodeToken = (payload: TTokenPayload, token_type: TToken) => {
  Object.assign(payload, { token_type });

  try {
    return jwt.sign(payload, config.jwt[token_type].secret, {
      expiresIn: config.jwt[token_type].expire_in,
    });
  } catch (error: any) {
    errorLogger.error(chalk.red('🔑 Failed to create token'), error);
    throw new ServerError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create token ::=> ' + error.message,
    );
  }
};

/**
 * Verify a token with improved error handling
 * @param token - The token to verify
 * @param token_type - The type of token to verify
 * @returns The decoded token
 */
export const decodeToken = (token: string | undefined, token_type: TToken) => {
  token = token?.trim()?.match(/[\w-]+\.[\w-]+\.[\w-]+/)?.[0];
  const error = new ServerError(
    StatusCodes.UNAUTHORIZED,
    `Please provide a valid ${enum_decode(token_type)}.`,
  );

  if (!token) throw error;

  try {
    return jwt.verify(token, config.jwt[token_type].secret) as TTokenPayload;
  } catch {
    throw error;
  }
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(config.bcrypt_salt_rounds);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const otpVerifyRateLimiter = rateLimit({
  windowMs: ms('15m'),
  max: 50,
  message:
    'Too many requests for account verification. Try again in 15 minutes.',
});

export const loginRateLimiter = rateLimit({
  windowMs: ms('10m'),
  max: 100,
  message: 'Too many login attempts. Try again in 10 minutes.',
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: ms('15m'),
  max: 50,
  message: 'Too many forgot password attempts. Try again in 15 minutes.',
});

export const registerRateLimiter = rateLimit({
  windowMs: ms('30m'),
  max: 100,
  message: 'Too many registration attempts. Try again in 30 minutes.',
});

export const changePasswordRateLimiter = rateLimit({
  windowMs: ms('15m'),
  max: 50,
  message: 'Too many change password attempts. Try again in 15 minutes.',
});
