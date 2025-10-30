/* eslint-disable no-unused-vars */
import { decodeToken } from '../auth/Auth.utils';
import { prisma } from '../../../utils/db';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { userDefaultOmit } from '../user/User.constant';
import { TAuthenticatedSocket } from './Socket.interface';

/**
 * Socket Authentication Middleware
 */
const socketAuth = async (
  socket: TAuthenticatedSocket,
  next: (err?: Error) => void,
) => {
  const token =
    socket.handshake?.auth?.token ?? socket.handshake?.headers?.authorization;

  try {
    const { uid } = decodeToken(token, 'access_token');

    const user = await prisma.user.findUnique({
      where: { id: uid },
      omit: userDefaultOmit,
    });

    if (!user)
      throw new ServerError(StatusCodes.NOT_FOUND, 'Your account is not found');

    socket.data.user = user;

    next();
  } catch (error) {
    if (error instanceof Error) next(error);
  }
};

export default socketAuth;
