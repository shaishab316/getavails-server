import z from 'zod';
import { exists } from '../../../utils/db/exists';

export const AgentValidations = {
  inviteArtist: z.object({
    body: z.object({
      artist_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
    }),
  }),

  processAgentRequest: z.object({
    body: z.object({
      artist_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
    }),
  }),
};
