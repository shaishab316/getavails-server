import { Mail as TMail } from '../../../../prisma';

/**
 * Mail Searchable Fields
 */
export const mailSearchableFields = [
  'name',
  'email',
  'message',
  'remarks',
] satisfies (keyof TMail)[];
