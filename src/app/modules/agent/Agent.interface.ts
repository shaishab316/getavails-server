import z from 'zod';
import { AgentValidations } from './Agent.validation';

export type TInviteAgent = z.infer<typeof AgentValidations.inviteAgent>['body'];

export type TProcessArtistRequest = z.infer<
  typeof AgentValidations.processArtistRequest
>['body'];
