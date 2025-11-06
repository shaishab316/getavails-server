import { StatusCodes } from 'http-status-codes';
import { Prisma, prisma } from '../../../utils/db';
import { TPurchaseTicket, TTicketMetadata } from './Ticket.interface';
import ServerError from '../../../errors/ServerError';
import { stripe } from '../payment/Payment.utils';
import config from '../../../config';
import ms from 'ms';

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
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    const ticketsData = Array.from(
      { length: quantity },
      (_, i) =>
        ({
          id: `ti${event_id.split('-')[1]}-${(lastTicket ? +lastTicket.id.split('-')[1] + 1 + i : 1).toString().padStart(8, '0')}`,
          event_id,
          user_id,
          price: event?.ticket_price,
          expires_at: new Date(Date.now() + ms('5m')), //? expire in 5 minutes if not payment done
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
      success_url: config.url.payment_success,
      cancel_url: config.url.payment_failure,
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
};
