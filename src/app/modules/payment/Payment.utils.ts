import Stripe from 'stripe';
import config from '../../../config';
import { prisma } from '../../../utils/db';

/**
 * Stripe instance
 */
export const stripe = new Stripe(config.payment.stripe.secret_key);

/**
 * Stripe webhook event map
 */
export const stripWebhookEventMap = {
  'account.updated': async (account: Stripe.Account) => {
    return prisma.user.updateMany({
      where: {
        stripe_account_id: account.id,
      },
      data: {
        is_stripe_connected: true,
      },
    });
  },
};
