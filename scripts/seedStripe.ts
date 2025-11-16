import { SubscriptionServices } from '../src/app/modules/subscription/Subscription.service';

SubscriptionServices.renewSubscriptionsAndWebhook().then(() => process.exit(0));
