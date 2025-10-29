import type z from 'zod';
import type { AgentValidations } from './Agent.validation';
import type { User as TUser } from '../../../../prisma';

export type TInviteArtist = z.infer<
  typeof AgentValidations.inviteArtist
>['body'] & { agent: TUser };

export type TProcessAgentRequest = z.infer<
  typeof AgentValidations.processAgentRequest
>['body'] & { agent: TUser; is_approved: boolean };
