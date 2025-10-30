/* eslint-disable no-unused-vars */
import { TToken } from './auth.types';

/**
 * Type for sending an email
 */
export type TSendMail = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Type for generating OTP
 */
export type TGenerateOTP = (args: {
  otpId: string;
  tokenType: TToken;
}) => string;

/**
 * Type for validating OTP
 */
export type TValidateOTP = (args: {
  otpId: string;
  tokenType: TToken;
  otp: string;
}) => boolean;
