/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import config from '../config';
import { errorLogger, logger } from './logger';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../errors/ServerError';
import chalk from 'chalk';
import type { TSendMail } from '../types/utils.types';

const { host, port, user, pass, from } = config.email;
const { mock_mail } = config.server;

/**
 * Nodemailer transporter
 *
 * used to send emails
 */
let transporter = nodemailer.createTransport({
  host,
  port,
  secure: false, //! true for 465, false for other ports
  auth: {
    user,
    pass,
  },
});

/**
 * If mock mail is enabled, use a mock transporter
 *
 * used for testing
 */
if (mock_mail) {
  logger.info(chalk.yellow('Mock mail enabled'));
  transporter = {
    sendMail: ({ to = 'mock_mail' }) => {
      logger.info(chalk.green('Mock mail sent'));
      return {
        accepted: [to],
      };
    },
    verify: () => true,
  } as any;
}

/**
 * Send email using nodemailer
 *
 * @param {TSendMail} { to, subject, html }
 *
 * @deprecated use emailQueue
 */
export const sendEmail = async ({ to, subject, html }: TSendMail) => {
  logger.info(chalk.yellow('Sending email...'), to);

  if (mock_mail) {
    console.log(chalk.blue('sent mail'), {
      to,
      subject,
    });
  }

  try {
    //? Send email
    const { accepted } = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    if (!accepted.length)
      throw new ServerError(StatusCodes.SERVICE_UNAVAILABLE, 'Mail not sent');

    logger.info(chalk.green(`✔ Mail send successfully. On: ${accepted[0]}`));
  } catch (error: any) {
    errorLogger.error(chalk.red('❌ Email send failed'), error.message);
    throw new ServerError(StatusCodes.SERVICE_UNAVAILABLE, error.message);
  }
};
