/* eslint-disable no-unused-vars */
import Stripe from 'stripe';
import config from '../../../config';
import { prisma } from '../../../utils/db';
import { PaymentServices } from './Payment.service';
import { subscriptionIntervalMap } from '../subscription/Subscription.utils';
import dayjs from 'dayjs';
import { TUserSubscriptionMetadata } from '../subscription/Subscription.interface';

/**
 * Stripe instance
 */
export const stripe = new Stripe(config.payment.stripe.secret_key, {
  apiVersion: '2025-09-30.clover',
});

/**
 * Stripe webhook event map
 */
type TStripWebhookEventMap = Partial<
  Record<Stripe.Event.Type, (event: any) => Promise<void>>
>;

/**
 * Stripe webhook event map
 */
export const stripWebhookEventMap = {
  /**
   * for stripe account connect
   *
   * @deprecated not working
   */
  'account.updated': async (account: Stripe.Account) => {
    await prisma.user.updateMany({
      where: {
        stripe_account_id: account.id,
      },
      data: {
        is_stripe_connected: true,
      },
    });
  },

  /**
   * for stripe checkout session
   */
  'checkout.session.completed': async (session: Stripe.Checkout.Session) => {
    //? ensure session has a purpose
    if (!session?.metadata?.purpose) return;

    const purposeFn =
      PaymentServices[
        session?.metadata?.purpose as keyof typeof PaymentServices
      ];

    if (purposeFn) await purposeFn(session as any);

    /**
     * Todo: save transaction info in db
     */
  },

  /**
   * ! in app subscription management
   */

  'customer.subscription.created': async (session: Stripe.Checkout.Session) => {
    const metadata = session.metadata as TUserSubscriptionMetadata;

    await prisma.user.update({
      where: { id: metadata.user_id },
      data: {
        subscription_name: metadata.subscription_name,
      },
    });
  },

  'invoice.paid': async (invoice: Stripe.Invoice) => {
    const metadata = invoice.parent?.subscription_details
      ?.metadata as TUserSubscriptionMetadata;

    const user = await prisma.user.findFirst({
      where: { id: metadata.user_id },
    });

    if (!user) return;

    const { interval, interval_count } =
      subscriptionIntervalMap[metadata.subscription_interval];

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
          subscription_name: metadata.subscription_name,
        },
      }),
      prisma.transaction.create({
        data: {
          stripe_transaction_id: (invoice as any).payment_intent ?? invoice.id,
          subscription_name: metadata.subscription_name,
          user_id: user.id,
          amount: invoice.amount_paid / 100,
        },
      }),
    ]);
  },

  'customer.subscription.updated': async (session: Stripe.Checkout.Session) => {
    const metadata = session.metadata as TUserSubscriptionMetadata;

    await prisma.user.update({
      where: { id: metadata.user_id },
      data: {
        subscription_name: metadata.subscription_name,
      },
    });
  },

  'customer.subscription.deleted': async (session: Stripe.Checkout.Session) => {
    const metadata = session.metadata as TUserSubscriptionMetadata;

    await prisma.user.update({
      where: { id: metadata.user_id },
      data: {
        subscription_expires_at: new Date(),
        is_active: false,
        subscription_name: null,
      },
      select: { id: true },
    });
  },
} satisfies TStripWebhookEventMap;
