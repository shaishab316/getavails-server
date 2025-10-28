import z from 'zod';
import { exists } from '../../../utils/db/exists';

export const ArtistValidations = {
  sentRequestToArtist: z.object({
    body: z.object({
      artist_id: z.string().refine(exists('user'), {
        error: ({ input }) => `Artist not found with id: ${input}`,
        path: ['artist_id'],
      }),
    }),
  }),
};
