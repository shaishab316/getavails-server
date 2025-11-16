/* eslint-disable no-console */
import chalk from 'chalk';
import cron from 'node-cron';
import ora from 'ora';
import { prisma } from '../../../utils/db';

export const subscriptionExpireJob = () => {
  console.log(chalk.green('✔ Subscription expiration job started'));
  //? every day at midnight
  const subscriptionJob = cron.schedule('0 0 * * *', async () => {
    const spinner = ora(chalk.yellow('Processing subscriptions...')).start();

    try {
      const result = await prisma.user.updateMany({
        where: {
          subscription_expires_at: {
            lt: new Date(),
          },
          is_active: true,
        },
        data: {
          is_active: false,
          subscription_name: null,
          subscription_expires_at: null,
        },
      });

      spinner.succeed(
        chalk.green(
          `Processed subscriptions. Deactivated ${result.count} users.`,
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        spinner.fail(
          chalk.red(`Failed to process subscriptions: ${error.message}`),
        );
      }
    }
  });

  //? return unsubscribe function
  return () => {
    subscriptionJob.destroy();
    console.log(chalk.blue('Subscription expiration job stopped'));
  };
};
