import z from 'zod';
import { exists } from '../../../utils/db/exists';
import type { TModelZod } from '../../../types/zod';
import {
  EAgentOfferStatus,
  EUserRole,
  AgentOffer as TAgentOffer,
} from '../../../../prisma';

/**
 * Validation for agent
 */
export const AgentValidations = {
  /**
   * Validation schema for invite artist
   */
  inviteArtist: z.object({
    body: z.object({
      artist_id: z.string().refine(exists('user', { role: EUserRole.ARTIST }), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
    }),
  }),

  /**
   * Validation schema for delete artist
   */
  deleteArtist: z.object({
    body: z.object({
      artist_id: z.string().refine(exists('user', { role: EUserRole.ARTIST }), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
    }),
  }),

  /**
   * Validation schema for process agent request
   */
  processAgentRequest: z.object({
    body: z.object({
      artist_id: z.string().refine(exists('user', { role: EUserRole.ARTIST }), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
    }),
  }),

  /**
   * Validation schema for create agent offer
   */
  createOffer: z.object({
    body: z.object({
      amount: z.coerce.number({ error: 'Amount is required' }),
      start_date: z.iso.datetime({ error: 'Start date is required' }),
      end_date: z.iso.datetime().optional(),
      artist_id: z.string().refine(exists('user', { role: EUserRole.ARTIST }), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
      organizer_id: z
        .string()
        .refine(exists('user', { role: EUserRole.ORGANIZER }), {
          error: ({ input }) => `Organizer not found with id: ${input}`,
          path: ['organizer_id'],
        }),
      location: z.string({ error: 'Location is required' }),
    } satisfies TModelZod<TAgentOffer>),
  }),

  /**
   * Validation schema for get agent offers
   */
  getMyOffers: z.object({
    query: z.object({
      status: z.enum(EAgentOfferStatus).default(EAgentOfferStatus.PENDING),
    }),
  }),

  /**
   *
   */
  cancelOffer: z.object({
    body: z.object({
      offer_id: z.string().refine(exists('agentOffer'), {
        error: ({ input }) => `Offer not found with id: ${input}`,
        path: ['offer_id'],
      }),
    }),
  }),
};
