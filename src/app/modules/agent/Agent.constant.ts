import { User as TUser } from '../../../../prisma';

export const agentSearchableFields = [
  'name',
  'email',
  'experience',
  'location',
  'id',
] satisfies (keyof TUser)[];
