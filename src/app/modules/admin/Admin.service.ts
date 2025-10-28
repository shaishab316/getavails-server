import chalk from 'chalk';
import { errorLogger } from '../../../utils/logger';
import { logger } from '../../../utils/logger';
import config from '../../../config';
import { prisma } from '../../../utils/db';
import { hashPassword } from '../auth/Auth.utils';
import { UserServices } from '../user/User.service';

export const AdminServices = {
  /**
   * Seeds the admin user if it doesn't exist in the database
   *
   * This function checks if an admin user already exists in the database.
   * If an admin user exists, it returns without creating a new one.
   * Otherwise, it creates a new admin user with the provided admin data.
   */
  async seed() {
    const { name, email, password } = config.admin;

    logger.info(chalk.green('🔑 admin seed started...'));

    try {
      const admin = await prisma.user.findFirst({
        where: { email },
      });

      if (admin?.is_admin && admin?.is_active && admin?.is_verified) return;

      logger.info(chalk.green('🔑 admin creation started...'));

      if (admin) {
        await prisma.user.update({
          where: {
            id: admin.id,
          },
          data: {
            is_active: true,
            is_verified: true,
            is_admin: true,
          },
        });
      } else {
        await prisma.user.create({
          data: {
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
      }

      logger.info(chalk.green('✔ admin created successfully!'));
    } catch (error) {
      errorLogger.error(chalk.red('❌ admin creation failed!'), error);
    } finally {
      logger.info(chalk.green('🔑 admin seed completed!'));
    }
  },
};
