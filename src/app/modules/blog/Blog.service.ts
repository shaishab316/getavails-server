import { type Prisma, prisma } from '../../../utils/db';
import type { TPagination } from '../../../utils/server/serveResponse';
import type { TList } from '../query/Query.interface';
import { blogSearchableFields } from './Blog.constant';
import type {
  TCreateBlogArgs,
  TDeleteBlogArgs,
  TUpdateBlogArgs,
} from './Blog.interface';

/**
 * Blog Services
 */
export const BlogServices = {
  /**
   * Creates a new blog post in the database.
   */
  async createBlog(payload: TCreateBlogArgs) {
    return prisma.blog.create({
      data: {
        ...payload,
        id: await this.genBlogSlug(payload.title),
      },
    });
  },

  /**
   * Updates an existing blog post in the database.
   */
  async updateBlog({ blog_id, ...payload }: TUpdateBlogArgs & { id: string }) {
    if (payload.title) {
      payload.id = await this.genBlogSlug(payload.title);
    }

    return prisma.blog.update({
      where: { id: blog_id },
      data: payload,
    });
  },

  /**
   * Deletes a blog post from the database.
   */
  async deleteBlog({ blog_id }: TDeleteBlogArgs) {
    return prisma.blog.delete({
      where: { id: blog_id },
      select: { id: true, title: true },
    });
  },

  /**
   * Retrieves a paginated list of blogs with optional search functionality.
   */
  async getBlogsList({ page, limit, search }: TList) {
    const where: Prisma.BlogWhereInput = {};

    if (search) {
      where.OR = blogSearchableFields.map(field => ({
        [field]: { contains: search, mode: 'insensitive' },
      }));
    }

    const blogs = await prisma.blog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { last_updated_at: 'desc' },
      include: {
        admin: { select: { name: true, avatar: true } },
      },
      omit: { admin_id: true },
    });

    const total = await prisma.blog.count({ where });

    return {
      blogs,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
    };
  },

  /**
   * Retrieves a single blog post by its ID.
   */
  async getBlogById(blog_id: string) {
    return prisma.blog.findUnique({
      where: { id: blog_id },
      include: {
        admin: { select: { name: true, avatar: true } },
      },
      omit: { admin_id: true },
    });
  },

  /**
   * Generates a unique slug for a blog post based on the given title.
   *
   * @param title - The title of the blog post.
   * @returns A unique slug string.
   */
  async genBlogSlug(title: string) {
    const base = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let candidate = base;

    //? Check for existing slugs that start with the base
    const existingBlog = await prisma.blog.findFirst({
      where: {
        id: {
          startsWith: base,
        },
      },
      orderBy: { published_at: 'desc' },
      select: { id: true },
    });

    if (!existingBlog) return candidate;

    //? If an existing slug is found, append a counter to make it unique
    const counter = Number(existingBlog.id.match(/-(\d+)$/)?.[1] ?? 1) + 1;
    let unique = false;

    while (!unique) {
      candidate = `${base}-${counter}`;
      //? Check if the candidate slug already exists
      const blog = await prisma.blog.findUnique({
        where: { id: candidate },
        select: { id: true },
      });

      if (!blog) {
        unique = true;
      }
    }

    return candidate;
  },
};
