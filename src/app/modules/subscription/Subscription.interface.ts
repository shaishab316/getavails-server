/* eslint-disable no-unused-vars */
import z from 'zod';
import { SubscriptionValidations } from './Subscription.validation';
import { TList } from '../query/Query.interface';
import { stripWebhookEventMap } from '../payment/Payment.utils';
import { ESubscriptionInterval } from '../../../utils/db';

export type TSubscriptionCreate = z.infer<
  typeof SubscriptionValidations.createSubscription
>['body'];

export type TSubscriptionEdit = z.infer<
  typeof SubscriptionValidations.editSubscription
>['body'];

export type TSubscriptionDelete = z.infer<
  typeof SubscriptionValidations.deleteSubscription
>['body'];

export type TGetAvailableSubscriptions = z.infer<
  typeof SubscriptionValidations.getAvailableSubscriptions
>['query'] &
  TList;

export enum EStripeSubscriptionInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export type TStripWebhookEvent = keyof typeof stripWebhookEventMap;

export type TUserSubscriptionMetadata = {
  purpose: 'subscription';
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar: string;
  subscription_name: string;
  subscription_features: string;
  subscription_interval: ESubscriptionInterval;
};
