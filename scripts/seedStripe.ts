/* eslint-disable no-console */
import {
  stripe,
  stripWebhookEventMap,
} from '../src/app/modules/payment/Payment.utils';
import config from '../src/config';
import env from '../src/utils/env';
import chalk from 'chalk';
import ora from 'ora';
import type { TStripWebhookEvent } from '../src/app/modules/payment/Payment.interface';

(async () => {
  const spinner = ora(chalk.blue('Setting up Stripe webhooks...')).start();
  if (process.env.STRIPE_WEB_HOOK_SECRET) {
    spinner.succeed(chalk.green('Webhooks already set up.'));
    return;
  }

  try {
    const events = Object.keys(stripWebhookEventMap) as TStripWebhookEvent[];

    if (!events.length) {
      spinner.fail(chalk.red('No events found to register.'));
      return;
    }

    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const { webhook_endpoint } = config.payment.stripe;

    const existingWebhook = webhooks.data.find(
      ({ url }) => url === webhook_endpoint,
    );

    if (existingWebhook) {
      spinner.text = chalk.yellow('🗑 Removing old webhook...');
      await stripe.webhookEndpoints.del(existingWebhook.id);
    }

    spinner.text = chalk.yellow('🔧 Creating new webhook...');

    const newWebhook = await stripe.webhookEndpoints.create({
      url: webhook_endpoint,
      enabled_events: events,
      description: `Webhook for ${config.server.name}`,
    });

    env('stripe web hook secret', newWebhook.secret, {
      regex: '^whsec_[0-9a-zA-Z]{32,}$',
    });

    spinner.succeed(chalk.green('Stripe webhooks setup successfully!'));
  } catch (error: any) {
    spinner.fail(chalk.red(`Webhook setup failed: ${error.message}`));
  }
})().then(() => process.exit(0));
