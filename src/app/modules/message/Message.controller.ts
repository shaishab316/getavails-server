import catchAsync from '../../middlewares/catchAsync';
import { MessageServices } from './Message.service';

/**
 * All message related controllers
 */
export const MessageControllers = {
  /**
   * Get chat messages
   */
  getChatMessages: catchAsync(async ({ query, user }) => {
    const { messages, meta } = await MessageServices.getChatMessages({
      ...query,
      user_id: user.id,
    });

    return {
      message: 'Messages retrieved successfully!',
      meta,
      data: messages.reverse(),
    };
  }),
};
