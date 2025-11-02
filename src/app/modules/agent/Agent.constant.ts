import type { Prisma, User as TUser } from '../../../utils/db';

/**
 * Fields that can be used to search for an agent
 */
export const agentSearchableFields = [
  'name',
  'email',
  'experience',
  'location',
  'id',
] satisfies (keyof TUser)[];

export const agentOfferSearchableFields = [
  'artist',
  'organizer',
  'artist',
] satisfies (keyof Prisma.AgentOfferWhereInput)[];
