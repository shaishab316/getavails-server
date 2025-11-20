import { Router } from 'express';
import { MailControllers } from './Mail.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { MailValidations } from './Mail.validation';

const free = Router();
{
  /**
   * Send Mail to Admin
   */
  free.post(
    '/',
    purifyRequest(MailValidations.sendMail),
    MailControllers.sendMail,
  );
}

const admin = Router();
{
  /**
   * Admin Get All Mail
   */
  admin.get(
    '/',
    purifyRequest(QueryValidations.list, MailValidations.getAllMail),
    MailControllers.getAllMail,
  );
}

export const MailRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/mails/
   */
  free,

  /**
   * Only admins can access
   *
   * @url : (base_url)/admin/mails/
   */
  admin,
};
