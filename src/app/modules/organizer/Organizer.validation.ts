import z from 'zod';
import { EAgentOfferStatus, EVenueOfferStatus } from '../../../../prisma';
import { exists } from '../../../utils/db/exists';

/**
 * Validation for organizer
 */
export const OrganizerValidations = {
  /**
   * Validation schema for get agent offers
   */
  getAgentOffers: z.object({
    query: z.object({
      status: z.enum(EAgentOfferStatus).default(EAgentOfferStatus.PENDING),
    }),
  }),

  /**
   * Validation schema for accept agent offer
   */
  acceptAgentOffer: z.object({
    body: z.object({
      offer_id: z.string().refine(exists('agentOffer'), {
        error: ({ input }) => `Agent offer not found with id: ${input}`,
        path: ['offer_id'],
      }),
    }),
  }),

  /**
   * Validation schema for get venue offers
   */
  getVenueOffers: z.object({
    query: z.object({
      status: z.enum(EVenueOfferStatus).default(EVenueOfferStatus.PENDING),
    }),
  }),
};
