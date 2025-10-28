/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import { decodeToken } from '../modules/auth/Auth.utils';
import catchAsync from './catchAsync';
import { prisma } from '../../utils/db';
import { EUserRole, User as TUser } from '../../../prisma';
import config from '../../config';
import { TToken } from '../../types/auth.types';

/**
 * Middleware to authenticate and authorize requests based on user roles
 *
 * @param token_type - The type of token to validate
 * @param validators - Array of validator functions to run on the user
 */
const auth = ({
  token_type = 'access_token',
  validators = [],
}: {
  token_type?: TToken;
  validators?: ((user: TUser) => void)[];
} = {}) =>
  catchAsync(async (req, _, next) => {
    const token = req.headers.authorization; //Todo: || req.cookies[token_type];

    const id = decodeToken(token, token_type)?.uid;

    if (!id) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'Your session has expired. Login again.',
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'Maybe your account has been deleted. Register again.',
      );
    }

    await Promise.all(validators.map(fn => fn(user)));

    req.user = user;

    next();
  });

// Common validator function
function commonValidator({ is_admin, is_verified, is_active }: TUser) {
  if (is_admin) return;

  if (!is_verified) {
    throw new ServerError(
      StatusCodes.FORBIDDEN,
      'Your account is not verified',
    );
  } else if (!is_active) {
    throw new ServerError(StatusCodes.FORBIDDEN, 'Your account is not active');
  }
}

// Base auth without role restrictions
auth.all = auth();

// Admin auth
auth.admin = auth({
  validators: [
    commonValidator,
    ({ is_admin }) => {
      if (!is_admin) {
        throw new ServerError(StatusCodes.FORBIDDEN, 'You are not an admin');
      }
    },
  ],
});

// Role based auth
Object.values(EUserRole).forEach(role => {
  Object.defineProperty(auth, role.toLowerCase(), {
    value: auth({
      validators: [
        commonValidator,
        user => {
          if (user.role !== role) {
            throw new ServerError(
              StatusCodes.FORBIDDEN,
              `You do not have ${role} permissions`,
            );
          }
        },
      ],
    }),
    enumerable: true,
    configurable: true,
  });
});

// Token based auth
Object.keys(config.jwt).forEach(token_type => {
  Object.defineProperty(auth, token_type, {
    value: auth({ token_type: token_type as TToken }),
    enumerable: true,
    configurable: true,
  });
});

export type TAuth = typeof auth & {
  [K in Lowercase<keyof typeof EUserRole>]: ReturnType<typeof auth>;
} & {
  [K in TToken]: ReturnType<typeof auth>;
};

export default auth as TAuth;
