import fs from 'fs';
import path from 'path';
import config from '../config';
import ms from 'ms';

export const otp_send_template = ({
  userName,
  otp,
  template,
}: {
  userName: string;
  otp: string;
  template: 'account_verify' | 'reset_password';
}) =>
  fs
    .readFileSync(
      path.resolve(process.cwd(), `public/pages/${template}_otp_send.html`),
      'utf-8',
    )
    .replace(
      /\/\* {{CSS}} \*\//g,
      `${fs.readFileSync(path.resolve(process.cwd(), 'public/pages/otp_verification_send.css'), 'utf-8')}`,
    )
    .replace(/{{SERVER_NAME}}/g, config.server.name)
    .replace(/{{USER_NAME}}/g, userName)
    .replace(
      /{{OTP_NUMBERS}}/g,
      otp
        .split('')
        .map(number => `<span class="otp-number">${number}</span>`)
        .join('\n'),
    )
    .replace(/{{OTP_EXPIRY_TIME}}/g, ms(ms(config.otp.exp), { long: true }))
    .replace(/{{CURRENT_YEAR}}/g, new Date().getFullYear().toString());
