import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EUserRole, Prisma, prisma, User as TUser } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import type { TList } from '../query/Query.interface';
import { artistSearchableFields } from './Artist.constant';
import type { TProcessArtistRequest, TInviteArtist } from './Artist.interface';
import { userOmit } from '../user/User.constant';
import { agentSearchableFields } from '../agent/Agent.constant';

export const ArtistServices = {
  async getArtistList({ limit, page, search }: TList) {
    const where: Prisma.UserWhereInput = {
      role: EUserRole.ARTIST,
    };

    if (search) {
      where.OR = artistSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const artists = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      omit: userOmit.ARTIST,
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

  async processArtistRequest({
    agent_id,
    is_approved,
    artist_id,
  }: TProcessArtistRequest) {
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

  /**
   * Retrieve all agent list for a specific artist
   *
   * @param {TUser['artist_agents']} artist_agents
   * @param {TList} { limit, page, search }
   */
  async getMyAgentList(
    { artist_agents }: TUser,
    { limit, page, search }: TList,
  ) {
    const agentWhere: Prisma.UserWhereInput = {
      id: { in: artist_agents },
      role: EUserRole.AGENT,
    };

    /**
     * Search agent using searchable fields
     */
    if (search) {
      agentWhere.OR = agentSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const agents = await prisma.user.findMany({
      where: agentWhere,
      skip: (page - 1) * limit,
      take: limit,
      //? exclude unnecessary fields
      omit: userOmit.AGENT,
    });

    const total = await prisma.user.count({ where: agentWhere });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
      agents,
    };
  },
};
