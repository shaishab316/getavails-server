import z from 'zod';
import { ArtistValidations } from './Artist.validation';

export type TSentRequestToArtist = z.infer<
  typeof ArtistValidations.sentRequestToArtist
>['body'] & { agent_id: string };
