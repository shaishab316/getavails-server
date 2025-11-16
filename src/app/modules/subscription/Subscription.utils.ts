/* eslint-disable no-unused-vars */
import dayjs from 'dayjs';
import { ESubscriptionInterval } from '../../../../prisma';
import { EStripeSubscriptionInterval } from './Subscription.interface';
import { prisma } from '../../../utils/db';

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

export const stripWebhookEventMap = {
  'customer.subscription.created': async (subscription: any) => {
    const userData = JSON.parse(subscription.metadata.user);
    const subscriptionData = JSON.parse(subscription.metadata.subscription);

    await prisma.user.update({
      where: { id: userData.id },
      data: {
        subscription_name: subscriptionData.name,
      },
    });
  },

  'invoice.paid': async (invoice: any) => {
    const userData = JSON.parse(
      invoice.parent.subscription_details.metadata.user,
    );
    const subscriptionData = JSON.parse(
      invoice.parent.subscription_details.metadata.subscription,
    );

    const user = await prisma.user.findFirst({
      where: { id: userData.id },
    });

    if (!user) return;

    const { interval, interval_count } =
      subscriptionIntervalMap[
        subscriptionData.subscription_interval as ESubscriptionInterval
      ];

    const currentExpiry = user.subscription_expires_at || new Date();
    const newExpiry = dayjs(currentExpiry)
      .add(interval_count, interval)
      .toDate();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          is_active: true,
          subscription_expires_at: newExpiry,
          subscription_name: subscriptionData.name,
        },
      }),
      prisma.transaction.create({
        data: {
          stripe_transaction_id: invoice.payment_intent ?? invoice.id,
          subscription_name: subscriptionData.name,
          user_id: user.id,
          amount: invoice.amount_paid / 100,
        },
      }),
    ]);
  },

  'customer.subscription.updated': async (subscription: any) => {
    const userData = JSON.parse(subscription.metadata.user);
    const subscriptionData = JSON.parse(subscription.metadata.subscription);

    if (!userData || !subscriptionData) return;

    await prisma.user.update({
      where: { id: userData.id },
      data: {
        subscription_name: subscriptionData.name,
      },
    });
  },

  'customer.subscription.deleted': async (subscription: any) => {
    const userData = JSON.parse(subscription.metadata.user);

    if (!userData) return;

    await prisma.user.update({
      where: { id: userData.id },
      data: {
        subscription_expires_at: new Date(),
        is_active: false,
        subscription_name: null,
      },
    });
  },
};
