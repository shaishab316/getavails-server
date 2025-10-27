import type z from 'zod';
import { VenueValidations } from './Venue.validation';

export type TUpdateVenue = z.infer<
  typeof VenueValidations.updateVenue
>['body'] & { venue_id: string };
