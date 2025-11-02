import type z from 'zod';
import type { AgentValidations } from './Agent.validation';
import type { User as TUser } from '../../../../prisma';

/**
 * @type: Invite artist for agent
 */
export type TInviteArtist = z.infer<
  typeof AgentValidations.inviteArtist
>['body'] & { agent: TUser };

/**
 * @type: Delete artist from agent list
 */
export type TDeleteArtist = z.infer<
  typeof AgentValidations.deleteArtist
>['body'] & { agent: TUser };

/**
 * @type: Approve or reject artist request from agent
 */
export type TProcessAgentRequest = z.infer<
  typeof AgentValidations.processAgentRequest
>['body'] & { agent: TUser; is_approved: boolean };

/**
 * @type: for create agent offer
 */
export type TCreateAgentOfferArgs = z.infer<
  typeof AgentValidations.createOffer
>['body'] & {
  agent_id: string;
};
