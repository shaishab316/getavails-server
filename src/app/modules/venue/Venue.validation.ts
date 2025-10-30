import z from 'zod';
import type { TModelZod } from '../../../types/zod';
import type { User as TUser } from '../../../../prisma';

export const VenueValidations = {
  updateVenue: z.object({
    body: z.object({
      name: z.string().optional(),
      email: z.email().optional(),
      location: z.string().optional(),
      capacity: z.coerce.number().optional(),
      venue_type: z.string().optional(),
      price: z.coerce.string().optional(),
    } satisfies TModelZod<TUser>),
  }),
};
