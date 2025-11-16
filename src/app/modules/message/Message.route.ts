import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { MessageValidations } from './Message.validation';
import { MessageControllers } from './Message.controller';
import { QueryValidations } from '../query/Query.validation';

const all = Router();
{
  all.get(
    '/',
    purifyRequest(QueryValidations.list, MessageValidations.getChatMessages),
    MessageControllers.getChatMessages,
  );
}

/**
 * All message related routes
 */
export const MessageRoutes = {
  /**
   * All user can access
   *
   * @url : (base_url)/messages/
   */
  all,
};
