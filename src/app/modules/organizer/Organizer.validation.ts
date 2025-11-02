import z from 'zod';
import { EAgentOfferStatus } from '../../../../prisma';

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
};
