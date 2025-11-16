import { Router } from 'express';
import { TransactionControllers } from './Transaction.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';

const all = Router();
{
  all.get(
    '/',
    purifyRequest(QueryValidations.list),
    TransactionControllers.getUserTransactions,
  );
}

const admin = Router();
{
  admin.get(
    '/',
    purifyRequest(QueryValidations.list),
    TransactionControllers.getSuperTransactions,
  );
}

export const TransactionRoutes = {
  /**
   * Only admin can access
   *
   *
   * @url : (base_url)/admin/transactions/
   */
  admin,

  /**
   * All authenticated users can access
   *
   * @url : (base_url)/transactions/
   */
  all,
};
