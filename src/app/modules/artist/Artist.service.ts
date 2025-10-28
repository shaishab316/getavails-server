import { StatusCodes } from 'http-status-codes';
import { EUserRole, Prisma } from '../../../../prisma';
import ServerError from '../../../errors/ServerError';
import { prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import type { TList } from '../query/Query.interface';
import { artistSearchableFields } from './Artist.constant';
import type { TProcessAgentRequest, TInviteArtist } from './Artist.interface';
import { userOmit } from '../user/User.constant';

export const ArtistServices = {
  async getArtistList({ limit, page, search }: TList) {
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

  async inviteArtist({ artist_id, agent_id }: TInviteArtist) {
    const artist = await prisma.user.findUnique({
      where: { id: artist_id, role: EUserRole.ARTIST },
      select: {
        artist_agents: true,
        artist_pending_agents: true,
      },
    });

    if (!artist) {
      throw new ServerError(StatusCodes.NOT_FOUND, 'Artist not found');
    }

    if (
      artist.artist_agents
        .concat(artist.artist_pending_agents)
        .includes(agent_id)
    ) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You have already sent request to this artist',
      );
    }

    return prisma.user.update({
      where: { id: artist_id },
      data: {
        artist_pending_agents: { push: agent_id },
      },
      omit: userOmit.ARTIST,
    });
  },

  async processAgentRequest({
    agent_id,
    is_approved,
    artist_id,
  }: TProcessAgentRequest) {
    const artist = (await prisma.user.findUnique({
      where: { id: artist_id },
      select: {
        artist_pending_agents: true,
      },
    }))!;

    if (!artist.artist_pending_agents.includes(agent_id)) {
      throw new ServerError(
        StatusCodes.NOT_FOUND,
        'Agent not found in pending list',
      );
    }

    const artistData: Prisma.UserUpdateInput = {
      artist_pending_agents: {
        //? Pop agent from pending list
        set: artist.artist_pending_agents.filter(id => id !== agent_id),
      },
    };

    return prisma.$transaction(async tx => {
      if (is_approved) {
        artistData.artist_agents = { push: agent_id };

        //? update into agent
        await tx.user.update({
          where: { id: agent_id },
          data: {
            agent_artists: { push: artist_id },
          },
          omit: userOmit.AGENT,
        });
      }

      //? update into artist
      await tx.user.update({
        where: { id: artist_id },
        data: artistData,
        omit: userOmit.ARTIST,
      });
    });
  },
};
