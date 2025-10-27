import type z from 'zod';
import { UserValidations } from './User.validation';

export type TUserRegister = z.infer<
  typeof UserValidations.userRegister
>['body'];

export type TUserEdit = z.infer<typeof UserValidations.editProfile>['body'];

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

export type TUpdateAvailability = z.infer<
  typeof UserValidations.updateAvailability
>['body'] & { user_id: string };

export type TUpdateVenue = z.infer<
  typeof UserValidations.updateVenue
>['body'] & { user_id: string };
