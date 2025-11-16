import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../middlewares/catchAsync';
import { BlogServices } from './Blog.service';

/**
 * Blog Module Controllers
 */
export const BlogControllers = {
  /**
   * Controller to handle the creation of a new blog post.
   */
  createBlog: catchAsync(async ({ body, user: admin }) => {
    const blog = await BlogServices.createBlog({
      ...body,
      admin_id: admin.id,
    });

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Blog created successfully',
      data: blog,
    };
  }),

  /**
   * Controller to handle the updating of an existing blog post.
   */
  updateBlog: catchAsync(async ({ body, user: admin }) => {
    const blog = await BlogServices.updateBlog({
      ...body,
      admin_id: admin.id,
    });

    return {
      message: 'Blog updated successfully',
      data: blog,
    };
  }),

  /**
   * Controller to handle the deletion of a blog post.
   */
  deleteBlog: catchAsync(async ({ body, user: admin }) => {
    const blog = await BlogServices.deleteBlog({
      ...body,
      admin_id: admin.id,
    });

    return {
      message: 'Blog deleted successfully',
      data: blog,
    };
  }),

  /**
   * Controller to retrieve a paginated list of blog posts.
   */
  getBlogsList: catchAsync(async ({ query }) => {
    const { blogs, meta } = await BlogServices.getBlogsList(query);

    return {
      message: 'Blogs retrieved successfully',
      meta,
      data: blogs,
    };
  }),

  /**
   * Controller to retrieve a single blog post by its ID.
   */
  getBlogById: catchAsync(async ({ params }) => {
    const blog = await BlogServices.getBlogById(params.blog_id);

    return {
      message: 'Blog retrieved successfully',
      data: blog,
    };
  }),
};
