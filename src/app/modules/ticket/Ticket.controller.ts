import catchAsync from '../../middlewares/catchAsync';
import { TicketServices } from './Ticket.service';

/**
 * All ticket related controllers
 */
export const TicketControllers = {
  /**
   * Purchase event tickets
   */
  purchaseTicket: catchAsync(async ({ body, user }) => {
    const tickets = await TicketServices.purchaseTicket({
      ...body,
      user_id: user.id,
    });

    return {
      message: 'Ticket created successfully!',
      data: tickets,
    };
  }),

  getSoldTickets: catchAsync(async ({ query }) => {
    const { meta, tickets } = await TicketServices.getSoldTickets(query);

    return {
      message: 'Sold tickets retrieved successfully!',
      meta,
      data: tickets,
    };
  }),
};
