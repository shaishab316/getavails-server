/* eslint-disable no-unused-vars */
import type { z } from 'zod';
import { ChatValidations } from './Chat.validation';

/**
 * Type for new chat
 */
export type TNewChatArgs = z.infer<typeof ChatValidations.newChat>['body'] & {
  target_id: string;
};

/**
 * Type for delete chat
 */
export type TDeleteChatArgs = z.infer<
  typeof ChatValidations.deleteChat
>['body'] & { user_id: string };
