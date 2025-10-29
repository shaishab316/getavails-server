import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EUserRole, Prisma, prisma, User as TUser } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import type { TList } from '../query/Query.interface';
import { artistSearchableFields } from './Artist.constant';
import type { TInviteAgent, TProcessArtistRequest } from './Artist.interface';
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

  async inviteAgent({ agent_id, artist }: TInviteAgent) {
    if (artist.artist_agents.includes(agent_id)) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You already have this agent',
      );
    }

    if (artist.artist_pending_agents.includes(agent_id)) {
      return this.processArtistRequest({
        is_approved: true,
        agent_id,
        artist,
      });
    }

    const agent = await prisma.user.findUnique({
      where: { id: agent_id, role: EUserRole.AGENT },
      select: {
        agent_pending_artists: true,
      },
    });

    if (!agent) {
      throw new ServerError(StatusCodes.NOT_FOUND, 'Agent not found');
    }

    if (agent.agent_pending_artists.includes(artist.id)) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You have already sent request to this artist',
      );
    }

    await prisma.user.update({
      where: { id: agent_id },
      data: {
        agent_pending_artists: { push: artist.id },
      },
      select: { id: true }, //? skip body
    });
  },

  async processArtistRequest({
    agent_id,
    is_approved,
    artist,
  }: TProcessArtistRequest) {
    const artistData: Prisma.UserUpdateInput = {
      artist_pending_agents: {
        //? Pop agent from pending list
        set: artist.artist_pending_agents.filter(id => id !== agent_id),
      },
    };

    await prisma.$transaction(async tx => {
      if (is_approved) {
        artistData.artist_agents = { push: agent_id };

        //? update into agent
        await tx.user.update({
          where: { id: agent_id },
          data: {
            agent_artists: { push: artist.id },
          },
          select: { id: true }, //? skip body
        });
      }

      //? update into artist
      await tx.user.update({
        where: { id: artist.id },
        data: artistData,
        select: { id: true }, //? skip body
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
