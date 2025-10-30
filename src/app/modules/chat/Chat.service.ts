import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { Chat as TChat, prisma } from '../../../utils/db';
import { TDeleteChatArgs, TNewChatArgs } from './Chat.interface';

/**
 * All chat related services
 */
export const ChatServices = {
  /**
   * Create new chat
   */
  async newChat({ user_id, target_id }: TNewChatArgs): Promise<TChat> {
    const user_ids = Array.from(new Set([user_id, target_id])).sort();

    if (user_ids.length < 2) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You cannot chat with yourself',
      );
    }

    //? find or create chat between users
    return prisma.chat.upsert({
      where: { user_ids },
      update: { user_ids },
      create: { user_ids },
    });
  },

  /**
   * Delete chat
   */
  async deleteChat({ chat_id, user_id }: TDeleteChatArgs): Promise<void> {
    const chat = await prisma.chat.findUnique({
      where: { id: chat_id },
      select: { user_ids: true },
    });

    //? ensure that user has permission to delete chat
    if (!chat?.user_ids.includes(user_id)) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        "You can't delete other's chat",
      );
    }

    await prisma.chat.delete({
      where: { id: chat_id },
      select: { id: true }, //? skip body
    });
  },
};
