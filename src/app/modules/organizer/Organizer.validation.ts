import z from 'zod';
import { EAgentOfferStatus } from '../../../../prisma';
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
};
