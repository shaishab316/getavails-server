import { PrismaClient } from '../../../prisma';
export * from '../../../prisma';

export const prisma = new PrismaClient();

/** Connect to the database */
export async function connectDB() {
  await prisma.$connect();

  return () => prisma.$disconnect();
}
