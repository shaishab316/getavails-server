import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EUserRole, Prisma, prisma, User as TUser } from '../../../utils/db';
import type { TPagination } from '../../../utils/server/serveResponse';
import type { TList } from '../query/Query.interface';
import { userOmit } from '../user/User.constant';
import { agentSearchableFields } from './Agent.constant';
import type { TInviteArtist, TProcessAgentRequest } from './Agent.interface';
import { artistSearchableFields } from '../artist/Artist.constant';

export const AgentServices = {
  async getAgentList({ limit, page, search }: TList) {
    const where: Prisma.UserWhereInput = {
      role: EUserRole.AGENT,
    };

    if (search) {
      where.OR = agentSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const agents = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      omit: userOmit.AGENT,
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
      agents,
    };
  },

  async inviteArtist({ artist_id, agent }: TInviteArtist) {
    if (agent.agent_artists.includes(artist_id)) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You already have this artist',
      );
    }

    if (agent.agent_pending_artists.includes(artist_id)) {
      return this.processAgentRequest({
        is_approved: true,
        artist_id,
        agent,
      });
    }

    const artist = await prisma.user.findUnique({
      where: { id: artist_id, role: EUserRole.ARTIST },
      select: {
        artist_pending_agents: true,
      },
    });

    if (!artist) {
      throw new ServerError(StatusCodes.NOT_FOUND, 'Artist not found');
    }

    if (artist.artist_pending_agents.includes(agent.id)) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You have already sent request to this artist',
      );
    }

    return prisma.user.update({
      where: { id: artist_id },
      data: {
        artist_pending_agents: { push: agent.id },
      },
      select: { id: true }, //? skip body
    });
  },

  async processAgentRequest({
    artist_id,
    is_approved,
    agent,
  }: TProcessAgentRequest) {
    const agentData: Prisma.UserUpdateInput = {
      agent_pending_artists: {
        //? Pop artist from pending list
        set: agent.agent_pending_artists.filter(id => id !== artist_id),
      },
    };

    await prisma.$transaction(async tx => {
      if (is_approved) {
        agentData.agent_artists = { push: artist_id };
      }

      //? update into artist
      await tx.user.update({
        where: { id: artist_id },
        data: {
          artist_agents: { push: agent.id },
        },
        select: { id: true }, //? skip body
      });

      //? update into agent
      return tx.user.update({
        where: { id: agent.id },
        data: agentData,
        select: { id: true }, //? skip body
      });
    });
  },

  /**
   * Retrieve all artist list for a specific agent
   *
   * @param {TUser['agent_artists']} agent_artists
   * @param {TList} { limit, page, search }
   */
  async getMyArtistList(
    { agent_artists }: TUser,
    { limit, page, search }: TList,
  ) {
    const artistWhere: Prisma.UserWhereInput = {
      id: { in: agent_artists },
      role: EUserRole.ARTIST,
    };

    /**
     * Search artist using searchable fields
     */
    if (search) {
      artistWhere.OR = artistSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const artists = await prisma.user.findMany({
      where: artistWhere,
      skip: (page - 1) * limit,
      take: limit,
      //? exclude unnecessary fields
      omit: userOmit.ARTIST,
    });

    const total = await prisma.user.count({ where: artistWhere });

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
