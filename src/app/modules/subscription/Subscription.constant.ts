import type { Prisma, Subscription as TSubscription } from '../../../utils/db';
import { ESubscriptionInterval } from '../../../../prisma';
import { EStripeSubscriptionInterval } from './Subscription.interface';

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

/**
 * Subscription interval map to stripe interval
 */
export const subscriptionIntervalMap: Record<
  ESubscriptionInterval,
  { interval: EStripeSubscriptionInterval; interval_count: number }
> = {
  WEEKLY: { interval: EStripeSubscriptionInterval.WEEK, interval_count: 1 },
  HALF_MONTHLY: {
    interval: EStripeSubscriptionInterval.DAY,
    interval_count: 15,
  },
  MONTHLY: {
    interval: EStripeSubscriptionInterval.MONTH,
    interval_count: 1,
  },
  TWO_MONTHLY: {
    interval: EStripeSubscriptionInterval.MONTH,
    interval_count: 2,
  },
  QUARTERLY: {
    interval: EStripeSubscriptionInterval.MONTH,
    interval_count: 3,
  },
  FOUR_MONTHLY: {
    interval: EStripeSubscriptionInterval.MONTH,
    interval_count: 4,
  },
  HALF_YEARLY: {
    interval: EStripeSubscriptionInterval.MONTH,
    interval_count: 6,
  },
  YEARLY: { interval: EStripeSubscriptionInterval.YEAR, interval_count: 1 },
  TWO_YEARLY: {
    interval: EStripeSubscriptionInterval.YEAR,
    interval_count: 2,
  },
};
