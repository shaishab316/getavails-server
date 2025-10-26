import type z from 'zod';
import { UserValidations } from './User.validation';

export type TUserRegister = z.infer<typeof UserValidations.register>['body'];

export type TUserEdit = z.infer<typeof UserValidations.edit>['body'];

export type TAgentRegister = z.infer<
  typeof UserValidations.agentRegister
>['body'];

export type TVenueRegister = z.infer<
  typeof UserValidations.venueRegister
>['body'];

export type TArtistRegister = z.infer<
  typeof UserValidations.artistRegister
>['body'];

export type TOrganizerRegister = z.infer<
  typeof UserValidations.organizerRegister
>['body'];
