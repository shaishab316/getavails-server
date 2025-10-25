import chalk from 'chalk';
import { Server } from 'http';
import { errorLogger, logger } from '../logger';
import config from '../../config';

/**
 * Shuts down the server
 *
 * This function shuts down the server gracefully when a signal is received.
 * It logs a message indicating that the server is shutting down and closes the server.
 */
export default async function shutdownServer(
  server: Server,
  signal: string,
  err?: Error,
) {
  if (err) errorLogger.error(chalk.red(`${signal} occurred: `), err);

  if (!config.server.isDevelopment) return;

  logger.info(chalk.magenta(`🔴 Shutting down server due to ${signal}...`));

  server.close(shutdownErr => {
    if (shutdownErr) {
      errorLogger.error(
        chalk.red('❌ Error during server shutdown'),
        shutdownErr,
      );
      process.exit(1);
    }

    logger.info(chalk.magenta('✅ Server closed.'));
    process.exit(0);
  });
}
