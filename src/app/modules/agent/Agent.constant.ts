import { User as TUser } from '../../../utils/db';

export const agentSearchableFields = [
  'name',
  'email',
  'experience',
  'location',
  'id',
] satisfies (keyof TUser)[];
