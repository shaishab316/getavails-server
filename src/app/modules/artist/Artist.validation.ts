import z from 'zod';
import { exists } from '../../../utils/db/exists';

/**
 * Validation for artist
 */
export const ArtistValidations = {
  /**
   * Validation schema for invite agent
   */
  inviteAgent: z.object({
    body: z.object({
      agent_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Agent not found with id: ${input}`,
        path: ['agent_id'],
      }),
    }),
  }),

  /**
   * Validation schema for delete agent
   */
  deleteAgent: z.object({
    body: z.object({
      agent_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Agent not found with id: ${input}`,
        path: ['agent_id'],
      }),
    }),
  }),

  /**
   * Validation schema for process artist request
   */
  processArtistRequest: z.object({
    body: z.object({
      agent_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Agent not found with id: ${input}`,
        path: ['agent_id'],
      }),
    }),
  }),
};
