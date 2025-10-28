import { User as TUser } from '../../../../prisma';

export const artistSearchableFields: (keyof TUser)[] = [
  'name',
  'email',
  'genre',
  'location',
  'id',
];
