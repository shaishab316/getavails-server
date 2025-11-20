import { Router } from 'express';
import { TicketControllers } from './Ticket.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { TicketValidations } from './Ticket.validation';
import { QueryValidations } from '../query/Query.validation';

const all = Router();
{
  /**
   * Purchase event tickets
   */
  all.post(
    '/purchase-ticket',
    purifyRequest(TicketValidations.purchaseTicket),
    TicketControllers.purchaseTicket,
  );
}

const organizer = Router();
{
  /**
   * Get sold tickets for an event
   */
  organizer.get(
    '/',
    purifyRequest(QueryValidations.list),
    TicketControllers.getSoldTickets,
  );
}

export const TicketRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/tickets/
   */
  all,

  /**
   * Only event organizers can access
   *
   * @url : (base_url)/organizer/tickets/
   */
  organizer,
};
