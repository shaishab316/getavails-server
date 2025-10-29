import z from 'zod';
import type { ArtistValidations } from './Artist.validation';
import type { User as TUser } from '../../../../prisma';

export type TInviteAgent = z.infer<
  typeof ArtistValidations.inviteAgent
>['body'] & { artist: TUser };

export type TProcessArtistRequest = z.infer<
  typeof ArtistValidations.processArtistRequest
>['body'] & { artist: TUser; is_approved: boolean };
