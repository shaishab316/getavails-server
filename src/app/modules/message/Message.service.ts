import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { prisma } from '../../../utils/db';
import type {
  TCreateMessageArgs,
  TDeleteMessageArgs,
} from './Message.interface';
import { deleteFiles } from '../../middlewares/capture';

/**
 * All message related services
 */
export const MessageServices = {
  /**
   * Create new message
   */
  async createMessage(payload: TCreateMessageArgs) {
    return prisma.message.create({
      data: payload,
      include: {
        chat: {
          select: {
            user_ids: true,
          },
        },
      },
    });
  },

  /**
   * Delete message
   */
  async deleteMessage({ message_id, user_id }: TDeleteMessageArgs) {
    const message = await prisma.message.findUnique({
      where: { id: message_id },
      select: { user_id: true, media_urls: true },
    });

    //? ensure that user has permission to delete message
    if (message?.user_id !== user_id) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        "You can't delete other's message",
      );
    }

    await deleteFiles(message.media_urls);

    return prisma.message.delete({
      where: { id: message_id },
      select: {
        chat: {
          select: {
            user_ids: true,
          },
        },
      },
    });
  },
};
