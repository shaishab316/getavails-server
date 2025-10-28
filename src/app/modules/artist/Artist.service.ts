import { EUserRole, Prisma } from '../../../../prisma';
import { prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { TList } from '../query/Query.interface';
import { artistSearchableFields } from './Artist.constant';

export const ArtistServices = {
  async getAllArtists({ limit, page, search }: TList) {
    const where: Prisma.UserWhereInput = {
      role: EUserRole.ARTIST,
    };

    if (search)
      where.OR = artistSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));

    const artists = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        avatar: true,
        gender: true,
        genre: true,
        location: true,
        availability: true,
        price: true,
        artist_agents: true,
        artist_pending_agents: true,
      },
    });

    const total = await prisma.user.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
      artists,
    };
  },
};
