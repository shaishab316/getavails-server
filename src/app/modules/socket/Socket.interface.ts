/* eslint-disable no-unused-vars */
import type { Namespace, Socket } from 'socket.io';
import { type User as TUser } from '../../../utils/db';
import { userDefaultOmit } from '../user/User.constant';

/**
 * Socket handler plugin
 */
export type TSocketHandler = ({
  io,
  socket,
}: {
  io: Namespace;
  socket: TAuthenticatedSocket;
}) => void;

/**
 * Authenticated Socket
 */
export interface TAuthenticatedSocket extends Socket {
  data: {
    user: Omit<TUser, keyof typeof userDefaultOmit>;
  };
}
