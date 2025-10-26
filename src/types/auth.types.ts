import config from '../config';

export type TToken = keyof typeof config.jwt;

export type TTokenPayload = {
  uid: string;
  exp?: number;
  iat?: number;
};
