import { StatusCodes } from 'http-status-codes';
import { EEventStatus, ETicketStatus, Prisma, prisma } from '../../../utils/db';
import {
  TGetSoldTickets,
  TPurchaseTicket,
  TTicketMetadata,
} from './Ticket.interface';
import ServerError from '../../../errors/ServerError';
import { stripe } from '../payment/Payment.utils';
import config from '../../../config';
import ms from 'ms';
import { ticketSearchableFields } from './Ticket.constant';
import { TPagination } from '../../../utils/server/serveResponse';

/**
 * Ticket services
 */
export const TicketServices = {
  /**
   * Purchase event tickets
   */
  async purchaseTicket({ quantity, event_id, user_id }: TPurchaseTicket) {
    const event = (await prisma.event.findUnique({
      where: { id: event_id },
      select: {
        available_capacity: true,
        ticket_price: true,
        title: true,
        description: true,
      },
    }))!;

    //? ensure that tickets are available
    if (event.available_capacity < quantity) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'Tickets are not available',
      );
    }

    const lastTicket = await prisma.ticket.findFirst({
      where: { event_id },
      orderBy: { sl: 'desc' },
      select: { id: true },
    });

    const ticketsData = Array.from(
      { length: quantity },
      (_, i) =>
        ({
          id: `ti${event_id.split('-')[1]}-${(lastTicket ? +lastTicket.id.split('-')[1] + 1 + i : 1 + i).toString().padStart(8, '0')}`,
          event_id,
          user_id,
          price: event?.ticket_price,
          expires_at: new Date(Date.now() + ms('5m')), //? expire in 5 minutes if not payment done
          sl: lastTicket ? +lastTicket.id.split('-')[1] + 1 + i : 1 + i,
        }) satisfies Prisma.TicketCreateManyInput,
    );

    await prisma.$transaction(async tx => {
      //? update into event
      await tx.event.update({
        where: { id: event_id },
        data: {
          available_capacity: {
            decrement: quantity,
          },
        },
      });

      //? create tickets
      await tx.ticket.createMany({
        data: ticketsData,
      });
    });

    const metadata: TTicketMetadata = {
      purpose: 'ticket_purchase',
      event_id,
      user_id,
      ticket_price: event.ticket_price.toString(),
      quantity: quantity.toString(),
      ticket_ids: ticketsData.map(({ id }) => id).join(','),
    };

    const { url } = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata,
      line_items: [
        {
          price_data: {
            currency: config.payment.currency,
            product_data: {
              name: `${event.title} Tickets (${quantity})`,
              description: event.description.slice(0, 100),
              metadata,
            },
            unit_amount: Math.ceil(event.ticket_price * 100),
          },
          quantity,
        },
      ],
      payment_method_types: config.payment.stripe.methods,
      success_url: config.url.payment.success_callback,
      cancel_url: config.url.payment.cancel_callback,
    });

    if (!url) {
      throw new ServerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create checkout session',
      );
    }

    return {
      url,
      tickets: ticketsData.map(({ id }) => id),
      ticket_price: event.ticket_price,
      quantity,
    };
  },

  /**
   * Get sold tickets with pagination and search
   */
  async getSoldTickets({ limit, page, search, status }: TGetSoldTickets) {
    const where: Prisma.TicketWhereInput = {
      status: ETicketStatus.PAID,
    };

    if (status === 'running') {
      where.event!.status = {
        in: [EEventStatus.UPCOMING, EEventStatus.PUBLISHED],
      };
    } else if (status === 'completed') {
      where.event!.status = {
        in: [EEventStatus.COMPLETED, EEventStatus.TIMEOUT],
      };
    }

    if (search) {
      where.OR = ticketSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const tickets = await prisma.ticket.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ created_at: 'desc' }, { event_id: 'asc' }],
      omit: { sl: true },
      include: {
        event: {
          select: {
            title: true,
            artist_names: true,
            start_date: true,
            end_date: true,
            available_capacity: true,
            capacity: true,
            status: true,
          },
        },
      },
    });

    const totalEarning = await prisma.ticket.aggregate({
      _sum: {
        price: true,
      },
      _count: { id: true },
      where: {
        status: ETicketStatus.PAID,
      },
    });

    const total = await prisma.ticket.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
        totalEarning: totalEarning._sum.price || 0,
        totalTicketSold: totalEarning._count.id || 0,
      },

      tickets: tickets,
    };
  },
};
