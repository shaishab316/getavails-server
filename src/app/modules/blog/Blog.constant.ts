import { Blog as TBlog } from '../../../utils/db';

/**
 * Blog searchable fields for search functionality.
 */
export const blogSearchableFields = [
  'id',
  'title',
  'content',
  'description',
] satisfies (keyof TBlog)[];
