import type z from 'zod';
import { AgentValidations } from './Agent.validation';

export type TInviteAgent = z.infer<
  typeof AgentValidations.inviteAgent
>['body'] & { artist_id: string };

export type TProcessAgentRequest = z.infer<
  typeof AgentValidations.processAgentRequest
>['body'] & { agent_id: string; is_approved: boolean };
