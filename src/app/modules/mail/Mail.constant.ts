import { Mail as TMail } from '../../../utils/db';

/**
 * Mail Searchable Fields
 */
export const mailSearchableFields = [
  'name',
  'email',
  'message',
  'remarks',
] satisfies (keyof TMail)[];
