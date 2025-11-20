import catchAsync from '../../middlewares/catchAsync';
import { MailServices } from './Mail.service';

/**
 * Mail Controllers
 */
export const MailControllers = {
  /**
   * Admin Send Mail
   */
  sendMail: catchAsync(async ({ body }) => {
    return {
      message: 'Mail sent successfully',
      data: await MailServices.sendMail(body),
    };
  }),

  /**
   * Admin Get All Mail
   */
  getAllMail: catchAsync(async ({ query }) => {
    const { mails, meta } = await MailServices.getAllMail(query);

    return {
      message: 'Mails fetched successfully',
      meta,
      data: mails,
    };
  }),
};
