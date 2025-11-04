import z from 'zod';
import { TList } from '../query/Query.interface';
import { OrganizerValidations } from './Organizer.validation';

/**
 * @type: Validation for get agent offers
 */
export type TGetAgentOffersForOrganizerArgs = TList &
  z.infer<typeof OrganizerValidations.getAgentOffers>['query'] & {
    organizer_id: string;
  };

/**
 * @type: Validation for get venue offers
 */
export type TGetVenueOffersForOrganizerArgs = TList &
  z.infer<typeof OrganizerValidations.getVenueOffers>['query'] & {
    organizer_id: string;
  };

/**
 * @type: Validation for accept agent offer
 */
export type TAcceptAgentOfferArgs = z.infer<
  typeof OrganizerValidations.acceptAgentOffer
>['body'] & {
  organizer_id: string;
};

/**
 * @type: Metadata for accept agent offer
 */
export type TAcceptAgentOfferMetadata = {
  purpose: 'agent_offer';
  amount: string;
  offer_id: string;
};
