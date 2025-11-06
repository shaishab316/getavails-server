import { Router } from 'express';
import { TicketControllers } from './Ticket.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { TicketValidations } from './Ticket.validation';

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

export const TicketRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/tickets/
   */
  all,
};
