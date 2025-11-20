import z from 'zod';
import type { TModelZod } from '../../../types/zod';
import {
  EUserRole,
  EVenueOfferStatus,
  type User as TUser,
  type VenueOffer as TVenueOffer,
} from '../../../utils/db';
import { exists } from '../../../utils/db/exists';

/**
 * Validation for venue
 */
export const VenueValidations = {
  /**
   * Validation schema for update venue
   */
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

  /**
   * Validation schema for create agent offer
   */
  createOffer: z.object({
    body: z.object({
      amount: z.coerce.number({ error: 'Amount is required' }),
      start_date: z.iso.datetime({ error: 'Start date is required' }),
      end_date: z.iso.datetime().optional(),
      organizer_id: z
        .string()
        .refine(exists('user', { role: EUserRole.ORGANIZER }), {
          error: ({ input }) => `Organizer not found with id: ${input}`,
          path: ['organizer_id'],
        }),
    } satisfies TModelZod<TVenueOffer>),
  }),

  /**
   *
   */
  cancelOffer: z.object({
    body: z.object({
      offer_id: z.string().refine(exists('venueOffer'), {
        error: ({ input }) => `Offer not found with id: ${input}`,
        path: ['offer_id'],
      }),
    }),
  }),

  /**
   * Validation schema for get agent offers
   */
  getMyOffers: z.object({
    query: z.object({
      status: z.enum(EVenueOfferStatus).default(EVenueOfferStatus.PENDING),
    }),
  }),
};
