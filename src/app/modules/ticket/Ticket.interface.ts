import type { z } from 'zod';
import type { TicketValidations } from './Ticket.validation';

/**
 * @type : Validation for purchase ticket
 */
export type TPurchaseTicket = z.infer<
  typeof TicketValidations.purchaseTicket
>['body'] & {
  user_id: string;
};

/**
 * @type : Ticket metadata
 */
export type TTicketMetadata = {
  purpose: 'ticket_purchase';
  ticket_price: string;
  quantity: string;
  event_id: string;
  user_id: string;
  ticket_ids: string;
};
