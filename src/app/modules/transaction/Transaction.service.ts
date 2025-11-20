import { Prisma, Transaction as TTransaction } from '../../../utils/db';
import { prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { TList } from '../query/Query.interface';
import { transactionSearchableFields as searchableFields } from './Transaction.constant';

export const TransactionServices = {
  async create(transactionData: TTransaction) {
    return prisma.transaction.create({ data: transactionData });
  },

  async getTransactions({
    page,
    limit,
    user_id,
    search,
  }: TList & { user_id?: string }) {
    const where: Prisma.TransactionWhereInput = {};

    if (user_id) where.user_id = user_id;

    if (search) {
      where.OR = searchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        subscription: {
          select: {
            name: true,
            features: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.transaction.count({
      where,
    });

    const totalAmount = await prisma.transaction.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
        totalAmount,
      },
      transactions,
    };
  },
};
