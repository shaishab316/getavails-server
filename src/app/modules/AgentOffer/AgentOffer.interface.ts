import type { z } from 'zod';
import type { AgentOfferValidations } from './AgentOffer.validation';

/**
 * Type for create agent offer
 */
export type TCreateAgentOfferArgs = z.infer<
  typeof AgentOfferValidations.createOffer
>['body'] & {
  agent_id: string;
};
