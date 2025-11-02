import chalk from 'chalk';
import ora from 'ora';
import config from '../../../config';
import { prisma } from '../../../utils/db';
import { hashPassword } from '../auth/Auth.utils';
import { UserServices } from '../user/User.service';

/**
 * Admin services
 */
export const AdminServices = {
  /**
   * Seeds the admin user if it doesn't exist in the database
   *
   * This function checks if an admin user already exists in the database.
   * If an admin user exists, it returns without creating a new one.
   * Otherwise, it creates a new admin user with the provided admin data.
   */
  async seed() {
    const spinner = ora({
      color: 'yellow',
      text: '⚙ Seeding admin user...',
    }).start();
    const { name, email, password } = config.admin;

    try {
      const admin = await prisma.user.findFirst({ where: { email } });

      if (admin?.is_admin) {
        spinner.succeed(chalk.green('Admin already exists. Skipped.'));
        return;
      }

      spinner.text = chalk.yellow('⚙ Creating/Updating admin user...');

      await prisma.user.upsert({
        where: { email },
        update: {
          is_active: true,
          is_verified: true,
          is_admin: true,
        },
        create: {
          id: await UserServices.getNextUserId({ is_admin: true }),
          name,
          email,
          password: await hashPassword(password),
          avatar: config.server.default_avatar,
          is_active: true,
          is_verified: true,
          is_admin: true,
        },
      });

      spinner.succeed(chalk.green('Admin is ready!'));
    } catch (error: any) {
      spinner.fail(chalk.red(`❌ Failed to seed admin user: ${error.message}`));
    }
  },
};
