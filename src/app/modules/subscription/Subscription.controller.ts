import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../middlewares/catchAsync';
import { SubscriptionServices } from './Subscription.service';
import ServerError from '../../../errors/ServerError';

export const SubscriptionControllers = {
  createSubscription: catchAsync(async ({ body }) => {
    const data = await SubscriptionServices.createSubscription(body);

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Subscription created successfully!',
      data,
    };
  }),

  editSubscription: catchAsync(async ({ body }) => {
    const data = await SubscriptionServices.editSubscription(body);

    return {
      message: 'Subscription updated successfully!',
      data,
    };
  }),

  deleteSubscription: catchAsync(async ({ body }) => {
    await SubscriptionServices.deleteSubscription(body.subscription_id);

    return {
      message: 'Subscription deleted successfully!',
    };
  }),

  getAvailableSubscriptions: catchAsync(async ({ query, user }) => {
    const { meta, subscriptions } =
      await SubscriptionServices.getAvailableSubscriptions(query);

    return {
      message: 'Subscriptions retrieved successfully!',
      meta,
      data: subscriptions.map(subscription => ({
        ...subscription,
        isOwned: subscription.name === user?.subscription_name,
      })),
    };
  }),

  getSubscriptionDetails: catchAsync(async ({ params, user }) => {
    const subscription = await SubscriptionServices.getSubscriptionDetails(
      params.subscriptionId,
    );

    return {
      message: 'Subscription retrieved successfully!',
      data: {
        ...subscription,
        isOwned: subscription?.name === user?.subscription_name,
      },
    };
  }),

  subscribePlan: catchAsync(async ({ user, params }) => {
    const { url, amount_total } = await SubscriptionServices.subscribePlan({
      ...params,
      user,
    });

    if (!url) {
      throw new ServerError(StatusCodes.SERVICE_UNAVAILABLE, 'Payment failed');
    }

    return {
      message: 'Subscription checkout url generated successfully!',
      data: { url, amount_total: amount_total && amount_total / 100 },
    };
  }),
};
