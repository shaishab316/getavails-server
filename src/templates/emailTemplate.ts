import fs from 'fs';
import path from 'path';
import config from '../config';
import ms from 'ms';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';

type TTemplate = {
  userName: string;
  otp: string;
  template: 'reset_password' | 'account_verify';
};

/**
 * use for cache
 */
const templates = new Map<string, string>();

/**
 * This function returns the email template.
 *
 * @param {TTemplate} { userName, otp, template }
 */
export const emailTemplate = async ({ otp, template, userName }: TTemplate) => {
  if (!templates.has(otp)) {
    const rawMjml = await fs.promises.readFile(
      path.join(process.cwd(), `/public/templates/emails/${template}.mjml`),
      'utf-8',
    );

    const data = {
      companyName: config.server.name,
      userName,
      otp,
      expiryTime: ms(ms(config.otp.exp), { long: true }),
      verificationUrl: `http://localhost:3000/verify?email`,
      supportUrl: config.email.support,
      privacyUrl: `http://localhost:3000/privacy`,
      unsubscribeUrl: `http://localhost:3000/unsubscribe?email`,
      currentYear: new Date().getFullYear(),
    };

    const { html } = mjml2html(Handlebars.compile(rawMjml)(data));

    templates.set(otp, html);
  }

  return templates.get(otp) ?? 'no content';
};
