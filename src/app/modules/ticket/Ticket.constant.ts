import { Ticket as TTicket } from '../../../utils/db';

export const ticketSearchableFields = [
  'id',
  'event_id',
  'user_id',
] satisfies (keyof TTicket)[];
