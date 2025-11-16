import type { z } from 'zod';
import type { BlogValidations } from './Blog.validation';

/**
 * Arguments for creating a new blog post.
 */
export type TCreateBlogArgs = z.infer<
  typeof BlogValidations.createBlog
>['body'] & { admin_id: string };

/**
 * Arguments for updating a blog post.
 */
export type TUpdateBlogArgs = z.infer<
  typeof BlogValidations.updateBlog
>['body'];

/**
 * Arguments for deleting a blog post.
 */
export type TDeleteBlogArgs = z.infer<
  typeof BlogValidations.deleteBlog
>['body'];
