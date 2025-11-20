import type z from 'zod';
import type { AgentValidations } from './Agent.validation';
import { User as TUser } from '../../../utils/db';
import { TList } from '../query/Query.interface';
import { OrganizerValidations } from '../organizer/Organizer.validation';

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
  agent: TUser;
  end_date: string;
};

/**
 * @type: for get agent offers
 */
export type TGetAgentOffersArgs = TList &
  z.infer<typeof OrganizerValidations.getAgentOffers>['query'] & {
    agent_id: string;
  };

/**
 * @type: for cancel agent offer
 */
export type TCancelAgentOfferArgs = z.infer<
  typeof AgentValidations.cancelOffer
>['body'] & {
  agent_id?: string;
  organizer_id?: string;
};

/**
 * @type: for get agent artist list
 */
export type TGetAgentArtistList = TList & { artist_ids: string[] };
