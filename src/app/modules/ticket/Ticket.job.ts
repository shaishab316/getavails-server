/* eslint-disable no-console */
import cron from 'node-cron';
import { ETicketStatus, prisma } from '../../../utils/db';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Ticket expiration job
 *
 * @returns unsubscribe function
 */
export function ticketExpirationJob() {
  console.log(chalk.green('✔ Ticket expiration job started'));

  /** every 5 minutes */
  const expirationJob = cron.schedule('*/5 * * * *', async () => {
    const spinner = ora(chalk.yellow('Deleting expired tickets...')).start();

    try {
      //? delete tickets that have expired
      const { count } = await prisma.ticket.deleteMany({
        where: {
          expires_at: {
            lte: new Date(),
          },
          status: {
            not: ETicketStatus.PAID,
          },
        },
      });

      spinner.succeed(chalk.green(`${count} tickets deleted successfully`));
    } catch (error) {
      if (error instanceof Error) {
        spinner.fail(
          chalk.red(`Error deleting expired tickets: ${error.message}`),
        );
      }
    }
  });

  return () => {
    expirationJob.destroy();
    console.log(chalk.cyan('Ticket expiration job stopped'));
  };
}
