import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { BlogControllers } from './Blog.controller';
import { BlogValidations } from './Blog.validation';

/**
 * Blog Module Routes
 */
const free = Router();
{
  /**
   * Route to get a paginated list of blog posts.
   */
  free.get(
    '/',
    purifyRequest(QueryValidations.list),
    BlogControllers.getBlogsList,
  );

  /**
   * Route to get a specific blog post by its ID.
   */
  free.get(
    '/:blog_id',
    purifyRequest(QueryValidations.exists('blog_id', 'blog')),
    BlogControllers.getBlogById,
  );
}

const admin = Router();
{
  /**
   * Route to create a new blog post.
   */
  admin.post(
    '/',
    purifyRequest(BlogValidations.createBlog),
    BlogControllers.createBlog,
  );

  /**
   * Route to update an existing blog post.
   */
  admin.patch(
    '/',
    purifyRequest(BlogValidations.updateBlog),
    BlogControllers.updateBlog,
  );

  /**
   * Route to delete a blog post.
   */
  admin.delete(
    '/',
    purifyRequest(BlogValidations.deleteBlog),
    BlogControllers.deleteBlog,
  );
}

export const BlogRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/blogs/
   */
  free,

  /**   * Only admin can access
   *
   * @url : (base_url)/admin/blogs/
   */
  admin,
};
