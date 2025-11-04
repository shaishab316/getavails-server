import type { z } from 'zod';
import type { VenueValidations } from './Venue.validation';

/**
 * Type for update venue
 */
export type TUpdateVenueArgs = z.infer<
  typeof VenueValidations.updateVenue
>['body'] & { venue_id: string };

/**
 * Type for create agent offer
 */
export type TVenueCreateOfferArgs = z.infer<
  typeof VenueValidations.createOffer
>['body'] & { venue_id: string; end_date: string };
