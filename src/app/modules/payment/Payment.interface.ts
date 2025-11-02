import { stripWebhookEventMap } from './Payment.utils';

export type TStripWebhookEvent = keyof typeof stripWebhookEventMap;
