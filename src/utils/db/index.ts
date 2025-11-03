/* eslint-disable no-console */
import chalk from 'chalk';
import ora from 'ora';
import { PrismaClient } from '../../../prisma';
export * from '../../../prisma';

export const prisma = new PrismaClient();

/** Connect to the database */
export async function connectDB() {
  const spinner = ora(chalk.blue('Connecting to database...')).start();

  try {
    await prisma.$connect();
    spinner.succeed(chalk.green('Database connected successfully'));
  } catch (error: any) {
    spinner.fail(chalk.red(`Database connection failed: ${error.message}`));
    process.exit(1); // exit server if db fails
  }

  // Graceful disconnect function
  return () => prisma.$disconnect();
}
