import type { z } from 'zod';
import type { EventValidations } from './Event.validation';

/**
 * @type: Validation for create event
 */
export type TCreateEvent = z.infer<
  typeof EventValidations.createEvent
>['body'] & { organizer_id: string };
