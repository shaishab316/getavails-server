import { stripWebhookEventMap } from './Payment.utils';

/**
 * Stripe webhook event
 */
export type TStripWebhookEvent = keyof typeof stripWebhookEventMap;
