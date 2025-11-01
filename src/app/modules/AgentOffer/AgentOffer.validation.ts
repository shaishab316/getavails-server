import z from 'zod';
import { exists } from '../../../utils/db/exists';
import type { TModelZod } from '../../../types/zod';
import type { Agent_offer as TAgent_offer } from '../../../../prisma';

/**
 * Validation for agent offer
 */
export const AgentOfferValidations = {
  /**
   * Validation schema for create agent offer
   */
  createOffer: z.object({
    body: z.object({
      amount: z.coerce.number({ error: 'Amount is required' }),
      start_date: z.iso.datetime({ error: 'Start date is required' }),
      end_date: z.iso.datetime().optional(),
      artist_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
      organizer_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Organizer not found with id: ${input}`,
        path: ['organizer_id'],
      }),
      address: z.string({ error: 'Address is required' }),
    } satisfies TModelZod<TAgent_offer>),
  }),
};
