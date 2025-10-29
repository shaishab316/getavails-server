import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EUserRole, Prisma, prisma, User as TUser } from '../../../utils/db';
import type { TPagination } from '../../../utils/server/serveResponse';
import type { TList } from '../query/Query.interface';
import { userOmit } from '../user/User.constant';
import { agentSearchableFields } from './Agent.constant';
import type { TInviteAgent, TProcessAgentRequest } from './Agent.interface';
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

  async inviteAgent({ agent_id, artist_id }: TInviteAgent) {
    const agent = await prisma.user.findUnique({
      where: { id: agent_id, role: EUserRole.AGENT },
      select: {
        agent_artists: true,
        agent_pending_artists: true,
      },
    });

    if (!agent) {
      throw new ServerError(StatusCodes.NOT_FOUND, 'Agent not found');
    }

    if (
      agent.agent_artists
        .concat(agent.agent_pending_artists)
        .includes(artist_id)
    ) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You have already sent request to this artist',
      );
    }

    return prisma.user.update({
      where: { id: agent_id },
      data: {
        agent_pending_artists: { push: artist_id },
      },
      omit: userOmit.AGENT,
    });
  },

  async processAgentRequest({
    artist_id,
    is_approved,
    agent_id,
  }: TProcessAgentRequest) {
    const agent = (await prisma.user.findUnique({
      where: { id: agent_id },
      select: {
        agent_pending_artists: true,
      },
    }))!;

    if (!agent.agent_pending_artists.includes(artist_id)) {
      throw new ServerError(
        StatusCodes.NOT_FOUND,
        'Artist not found in pending list',
      );
    }

    const agentData: Prisma.UserUpdateInput = {
      agent_pending_artists: {
        //? Pop artist from pending list
        set: agent.agent_pending_artists.filter(id => id !== artist_id),
      },
    };

    return prisma.$transaction(async tx => {
      if (is_approved) {
        agentData.agent_artists = { push: artist_id };
      }

      //? update into artist
      await tx.user.update({
        where: { id: artist_id },
        data: {
          artist_agents: { push: agent_id },
        },
        omit: userOmit.ARTIST,
      });

      //? update into agent
      return tx.user.update({
        where: { id: agent_id },
        data: agentData,
        omit: userOmit.AGENT,
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
