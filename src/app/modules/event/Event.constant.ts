import { Event as TEvent } from '../../../utils/db';

export const eventSearchableField = [
  'id',
  'title',
  'description',
  'location',
] satisfies (keyof TEvent)[];
