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

/**
 * @type: Validation for accept venue offer
 */
export type TAcceptVenueOfferArgs = z.infer<
  typeof OrganizerValidations.acceptVenueOffer
>['body'] & {
  organizer_id: string;
};

/**
 * @type: Metadata for accept venue offer
 */
export type TAcceptVenueOfferMetadata = {
  purpose: 'venue_offer';
  amount: string;
  offer_id: string;
};

/**
 * @type: Validation for get active artists
 */
export type TGetActiveVenues = TList & {
  organizer_id: string;
};

/**
 * @type: Validation for get active artists
 */
export type TGetActiveArtists = TList & {
  organizer_id: string;
};
