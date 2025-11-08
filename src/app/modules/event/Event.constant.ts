import { Event as TEvent } from '../../../../prisma';

export const eventSearchableField = [
  'id',
  'title',
  'description',
  'location',
] satisfies (keyof TEvent)[];
