import z from 'zod';
import { ArtistValidations } from './Artist.validation';

export type TInviteArtist = z.infer<
  typeof ArtistValidations.inviteArtist
>['body'] & { agent_id: string };

export type TProcessArtistRequest = z.infer<
  typeof ArtistValidations.processArtistRequest
>['body'] & { artist_id: string; is_approved: boolean };
