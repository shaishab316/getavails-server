import type { z } from 'zod';
import type { EventValidations } from './Event.validation';
import { TList } from '../query/Query.interface';

/**
 * @type: Validation for create event
 */
export type TCreateEvent = z.infer<
  typeof EventValidations.createEvent
>['body'] & { organizer_id: string };

/**
 * @type: Validation for get my upcoming event
 */
export type TGetMyUpcomingEvent = TList & {
  user_id: string;
};

/**
 * @type: Validation for get organizer event
 */
export type TGetOrganizerEvent = z.infer<
  typeof EventValidations.getOrganizerEvent
>['query'] &
  TList & {
    organizer_id: string;
  };
