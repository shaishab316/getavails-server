import z from 'zod';
import { exists } from '../../../utils/db/exists';

/**
 * Validation for ticket
 */
export const TicketValidations = {
  /**
   * Validation schema for purchase ticket
   */
  purchaseTicket: z.object({
    body: z.object({
      event_id: z.string().refine(
        exists('event', {
          //? ensure that event can buy tickets
          can_buy_tickets: true,
          //? ensure that tickets are available
          available_capacity: { gt: 0 },
          //? ensure that start date is in the future
          start_date: { gte: new Date() },
        }),
        {
          error: ({ input }) =>
            `Event not found with id: ${input} or tickets are not available`,
        },
      ),
      quantity: z.coerce
        .number()
        .min(1, 'Quantity must be at least 1')
        .default(1),
    }),
  }),
};
