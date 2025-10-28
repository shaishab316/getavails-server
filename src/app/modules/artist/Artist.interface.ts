import z from 'zod';
import { ArtistValidations } from './Artist.validation';

export type TInviteArtist = z.infer<
  typeof ArtistValidations.inviteArtist
>['body'] & { agent_id: string };

export type TProcessAgentRequest = z.infer<
  typeof ArtistValidations.processAgentRequest
>['body'] & { artist_id: string; is_approved: boolean };
