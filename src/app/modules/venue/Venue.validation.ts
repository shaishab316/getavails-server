import z from 'zod';
import { TModelZod } from '../../../types/zod';
import { Venue as TVenue } from '../../../../prisma';

export const VenueValidations = {
  updateVenue: z.object({
    body: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      location: z.string().optional(),
      capacity: z.coerce.number().optional(),
      venue_type: z.string().optional(),
      price: z.coerce.string().optional(),
    } satisfies TModelZod<TVenue>),
  }),
};
