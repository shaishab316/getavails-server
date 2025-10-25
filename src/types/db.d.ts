import { PrismaClient } from '../../prisma';

export type TModels = {
  [K in keyof PrismaClient]: PrismaClient[K] extends { findMany: any }
    ? K
    : never;
}[keyof PrismaClient];
