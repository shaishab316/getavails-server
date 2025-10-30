import type { User as TUser } from '../../../utils/db';

/**
 * Fields that can be used to search for an artist
 */
export const artistSearchableFields = [
  'name',
  'email',
  'genre',
  'location',
  'id',
] satisfies (keyof TUser)[];
