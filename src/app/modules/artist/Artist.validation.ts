import z from 'zod';
import { exists } from '../../../utils/db/exists';

export const ArtistValidations = {
  inviteAgent: z.object({
    body: z.object({
      agent_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Agent not found with id: ${input}`,
        path: ['agent_id'],
      }),
    }),
  }),

  processArtistRequest: z.object({
    body: z.object({
      agent_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Agent not found with id: ${input}`,
        path: ['agent_id'],
      }),
    }),
  }),
};
