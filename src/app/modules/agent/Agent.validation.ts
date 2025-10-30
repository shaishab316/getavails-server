import z from 'zod';
import { exists } from '../../../utils/db/exists';

/**
 * Validation for agent
 */
export const AgentValidations = {
  /**
   * Validation schema for invite artist
   */
  inviteArtist: z.object({
    body: z.object({
      artist_id: z.string().refine(
        //? ensure that the artist exists, if it does not exist, throw an error
        exists('user'),
        {
          error: ({ input }) => `Artist not found with id: ${input}`,
          path: ['artist_id'],
        },
      ),
    }),
  }),

  /**
   * Validation schema for delete artist
   */
  deleteArtist: z.object({
    body: z.object({
      artist_id: z.string().refine(
        //? ensure that the artist exists, if it does not exist, throw an error
        exists('user'),
        {
          error: ({ input }) => `Artist not found with id: ${input}`,
          path: ['artist_id'],
        },
      ),
    }),
  }),

  /**
   * Validation schema for process agent request
   */
  processAgentRequest: z.object({
    body: z.object({
      artist_id: z.string().refine(
        //? ensure that the artist exists, if it does not exist, throw an error
        exists('user'),
        {
          error: ({ input }) => `Artist not found with id: ${input}`,
          path: ['artist_id'],
        },
      ),
    }),
  }),
};
