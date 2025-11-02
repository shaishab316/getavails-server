import z from 'zod';
import { TList } from '../query/Query.interface';
import { OrganizerValidations } from './Organizer.validation';

/**
 * Type for get agent offers
 */
export type TGetAgentOffersForOrganizerArgs = TList &
  z.infer<typeof OrganizerValidations.getAgentOffers>['query'] & {
    organizer_id: string;
  };
