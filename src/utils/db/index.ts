/* eslint-disable no-console */
import chalk from 'chalk';
import { PrismaClient } from '../../../prisma';
export * from '../../../prisma';

export const prisma = new PrismaClient();

/** Connect to the database */
export async function connectDB() {
  console.log(chalk.yellow('🚀 Database connecting....'));
  await prisma.$connect();
  console.log(chalk.green('🚀 Database connected successfully'));

  return () => prisma.$disconnect();
}
