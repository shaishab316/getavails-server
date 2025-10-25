/* eslint-disable no-console */
import chalk from 'chalk';
import { createServer } from 'http';
import app from '../../app';
import config from '../../config';
import { errorLogger, logger } from '../logger';
import shutdownServer from './shutdownServer';

const server = createServer(app);

const {
  server: { port, name },
} = config;

/**
 * Starts the server
 *
 * This function creates a new HTTP server instance and connects to the database.
 * It also seeds the admin user if it doesn't exist in the database.
 */
export default async function startServer() {
  try {
    await new Promise<void>(resolve => server.listen(port, resolve));

    process.stdout.write('\x1Bc');
    console.log(chalk.gray('[console cleared]'));
    logger.info(
      chalk.yellow(`🚀 ${name} is running on http://localhost:${port}`),
    );

    ['SIGTERM', 'SIGINT', 'unhandledRejection', 'uncaughtException'].forEach(
      signal =>
        process.on(signal, async (err?: Error) => {
          await shutdownServer(server, signal, err);
        }),
    );

    return server;
  } catch (error) {
    errorLogger.error(chalk.red('❌ Server startup failed!'), error);
    process.exit(1);
  }
}
