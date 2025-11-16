import { Transaction as TTransaction } from '../../../../prisma';

export const transactionSearchableFields: (keyof TTransaction)[] = [
  'stripe_transaction_id',
  'subscription_name',
];
