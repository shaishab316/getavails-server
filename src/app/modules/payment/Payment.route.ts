import { Router } from 'express';
import { PaymentControllers } from './Payment.controller';

const free = Router();
{
  /**
   * Stripe Webhook for event listening
   */
  free.all('/stripe/webhook', PaymentControllers.stripeWebhook);

  free.all('/stripe/connect', PaymentControllers.stripConnect);
}

/**
 * Payment routes
 */
export const PaymentRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/payments/
   */
  free,
};
