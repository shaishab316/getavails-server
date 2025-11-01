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
    return prisma.$transaction(async tx => {
      //? update chat timestamp
      tx.chat.update({
        where: { id: payload.chat_id },
        data: { timestamp: new Date() },
      });

      //? create message
      return tx.message.create({
        data: {
          ...payload,
          seen_by: {
            connect: {
              id: payload.user_id,
            },
          },
        },
        include: {
          chat: {
            select: {
              user_ids: true,
            },
          },
          seen_by: {
            select: {
              avatar: true,
            },
          },
        },
      });
    });
  },

  /**
   * Delete message
   */
  async deleteMessage({ message_id, user_id }: TDeleteMessageArgs) {
    const message = await prisma.message.findUnique({
      where: { id: message_id },
      select: { user_id: true, media_urls: true, isDeleted: true },
    });

    //? ensure that user has permission to delete message
    if (message?.user_id !== user_id) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        "You can't delete other's message",
      );
    }

    if (message.isDeleted) {
      throw new ServerError(StatusCodes.BAD_REQUEST, 'Message already deleted');
    }

    await deleteFiles(message.media_urls);

    return prisma.message.update({
      where: { id: message_id },
      data: {
        media_urls: [],
        text: '𝒹𝑒𝓁𝑒𝓉𝑒𝒹 𝓂𝑒𝓈𝓈𝒶𝑔𝑒',
        isDeleted: true,
      },
      select: {
        chat: {
          select: { id: true, user_ids: true },
        },
      },
    });
  },
};
