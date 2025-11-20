import { Prisma, prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { mailSearchableFields } from './Mail.constant';
import { TAdminMailGetAll, TAdminMailSend } from './Mail.interface';

/**
 * Mail Services
 */
export const MailServices = {
  /**
   * Admin Send Mail
   */
  async sendMail(payload: TAdminMailSend) {
    return prisma.mail.create({
      data: payload,
    });
  },

  /**
   * Admin Get All Mail
   */
  async getAllMail({ page, limit, search, unread, remarks }: TAdminMailGetAll) {
    const mailWhere: Prisma.MailWhereInput = {};

    if (search) {
      mailWhere.OR = mailSearchableFields.map(field => ({
        [field]: { contains: search, mode: 'insensitive' },
      }));
    }

    if (unread) {
      mailWhere.unread = true;
    }

    if (remarks) {
      mailWhere.remarks = remarks;
    }

    const mails = await prisma.mail.findMany({
      where: mailWhere,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ unread: 'desc' }, { timestamp: 'desc' }],
    });

    /**
     * Mark all fetched mails as read
     */
    await Promise.all(
      mails
        .filter(({ unread }) => unread)
        .map(({ id }) =>
          prisma.mail.update({
            where: { id },
            data: { unread: false },
          }),
        ),
    );

    const total = await prisma.mail.count({ where: mailWhere });

    return {
      mails,
      meta: {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
    };
  },
};
