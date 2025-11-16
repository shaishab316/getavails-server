import { Subscription as TSubscription } from '../../../../prisma';

export const subscriptionSearchableFields: (keyof TSubscription)[] = [
  'name',
  'stripe_product_id',
  'stripe_subscription_id',
];
