/* eslint-disable no-console */
import chalk from 'chalk';
import { createServer } from 'http';
import app from '../../app';
import config from '../../config';
import { errorLogger, logger } from '../logger';
import { connectDB } from '../db';

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
    const disconnectDB = await connectDB();

    await new Promise<void>(done => server.listen(port, '0.0.0.0', done));

    process.stdout.write('\x1Bc');
    console.log(chalk.gray('[console cleared]'));
    logger.info(
      chalk.yellow(`🚀 ${name} is running on http://localhost:${port}`),
    );

    ['SIGINT', 'SIGTERM', 'unhandledRejection', 'uncaughtException'].forEach(
      signal => process.on(signal, closeServer),
    );

    server.once('close', disconnectDB);

    return server;
  } catch (error) {
    errorLogger.error(chalk.red('❌ Server startup failed!'), error);
    server?.close();
    process.exit(1);
  }
}

function closeServer(error: Error) {
  errorLogger.error(chalk.red('❌ Server closed!'), error);
  server.close();
  process.exit(0);
}
