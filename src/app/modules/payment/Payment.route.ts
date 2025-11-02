import { Router } from 'express';
import { PaymentControllers } from './Payment.controller';

const free = Router();
{
  free.all('/stripe/webhook', PaymentControllers.stripeWebhook);
  free.all('/stripe/connect', PaymentControllers.stripConnect);
}

export const PaymentRoutes = { free };
