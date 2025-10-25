/* eslint-disable no-console */
import { createLogger, format, transports } from 'winston';
import config from '../../config';
import stripAnsi from 'strip-ansi';
import path from 'path';

const { combine, timestamp, label, printf } = format;

const logDir = path.resolve(process.cwd(), 'logs');

// Format for console (keeps colors)
const consoleFormat = combine(
  label({ label: config.server.name }),
  timestamp(),
  printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp} [${label}] ${level}: ${message}`,
  ),
);

// Format for file (removes colors)
const fileFormat = combine(
  label({ label: config.server.name }),
  timestamp(),
  format(info => {
    info.message = stripAnsi(info.message as string); // remove ANSI colors
    return info;
  })(),
  printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp} [${label}] ${level}: ${message}`,
  ),
);

/**
 * Logger for info messages
 */
export const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      level: 'info',
      format: fileFormat,
    }),
  ],
});

/**
 * Logger for error messages
 */
export const errorLogger = createLogger({
  level: 'error',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
  ],
});
