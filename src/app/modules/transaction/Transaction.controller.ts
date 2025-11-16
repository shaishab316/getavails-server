import catchAsync from '../../middlewares/catchAsync';
import { TransactionServices } from './Transaction.service';

export const TransactionControllers = {
  getUserTransactions: catchAsync(async ({ user, query }) => {
    const { meta, transactions } = await TransactionServices.getTransactions({
      ...query,
      user_id: user.id,
    });

    return {
      message: 'Transactions retrieved successfully!',
      meta,
      data: transactions,
    };
  }),

  getSuperTransactions: catchAsync(async ({ query }) => {
    const { meta, transactions } =
      await TransactionServices.getTransactions(query);

    return {
      message: 'Transactions retrieved successfully!',
      meta,
      data: transactions,
    };
  }),
};
