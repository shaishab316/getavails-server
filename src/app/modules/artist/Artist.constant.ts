import { User as TUser } from '../../../utils/db';

export const artistSearchableFields = [
  'name',
  'email',
  'genre',
  'location',
  'id',
] satisfies (keyof TUser)[];
