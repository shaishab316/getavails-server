import { Ticket as TTicket } from '../../../../prisma';

export const ticketSearchableFields = [
  'id',
  'event_id',
  'user_id',
] satisfies (keyof TTicket)[];
