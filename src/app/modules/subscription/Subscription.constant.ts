import type { Prisma, Subscription as TSubscription } from '../../../utils/db';

/**
 * Searchable fields in subscription model
 */
export const subscriptionSearchableFields: (keyof TSubscription)[] = [
  'name',
  'stripe_product_id',
  'stripe_subscription_id',
];

/**
 * Omit fields from subscription model
 */
export const subscriptionOmit = {
  stripe_product_id: true,
  stripe_subscription_id: true,
} satisfies Prisma.SubscriptionOmit;
