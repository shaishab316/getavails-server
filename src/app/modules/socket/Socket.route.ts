import { MessageSocket } from '../message/Message.socket';
import { TSocketHandler } from './Socket.interface';

const router = new Map<string, TSocketHandler>();
{
  router.set('/message', MessageSocket);
}

/**
 * Socket routes or namespace
 */
export const SocketRoutes = router;
