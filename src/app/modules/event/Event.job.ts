/* eslint-disable no-console */
import cron from 'node-cron';
import { EEventStatus, prisma } from '../../../utils/db';
import ora from 'ora';
import chalk from 'chalk';

/**
 * Event jobs
 *
 * @returns unsubscribe function
 */
export function eventPublishingJob() {
  console.log(chalk.green('✔ Event jobs started'));

  //? every day at 7am
  const publishingJob = cron.schedule('0 7 * * *', async () => {
    const spinner = ora(chalk.yellow('Publishing events...')).start();

    try {
      await prisma.event.updateMany({
        where: {
          status: EEventStatus.UPCOMING,
          published_at: {
            lte: new Date(),
          },
        },
        data: {
          status: EEventStatus.PUBLISHED,
          published_at: new Date(),
        },
      });

      spinner.succeed(chalk.green('Events published successfully'));
    } catch (error) {
      if (error instanceof Error) {
        spinner.fail(chalk.red(`Error publishing events: ${error.message}`));
      }
    }
  });

  //? return unsubscribe function
  return () => {
    publishingJob.destroy();
    console.log(chalk.cyan('Event jobs stopped'));
  };
}
