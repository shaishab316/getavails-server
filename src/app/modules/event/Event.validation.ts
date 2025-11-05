import z from 'zod';
import { TModelZod } from '../../../types/zod';
import { EEventStatus, EUserRole, Event as TEvent } from '../../../../prisma';
import { exists } from '../../../utils/db/exists';

export const EventValidations = {
  createEvent: z.object({
    body: z.object({
      status: z.enum(EEventStatus).optional(),
      title: z.string({ error: 'Title is required' }).nonempty({
        message: 'Title is required',
      }),
      images: z.array(z.string()).optional(),
      description: z.string({ error: 'Description is required' }).nonempty({
        message: 'Description is required',
      }),
      start_date: z.iso.datetime({ error: 'Start date is required' }),
      end_date: z.iso.datetime().optional(),
      location: z.string({ error: 'Location is required' }).nonempty({
        message: 'Location is required',
      }),
      ticket_price: z.coerce.number({ error: 'Ticket price is required' }),
      capacity: z.coerce.number().optional(),
      artist_id: z.string().refine(exists('user', { role: EUserRole.ARTIST }), {
        error: ({ input }) => `Artist not found with id: ${input}`,
      }),
    } satisfies TModelZod<TEvent>),
  }),
};
