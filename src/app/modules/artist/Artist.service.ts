import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EUserRole, Prisma, prisma, User as TUser } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import type { TList } from '../query/Query.interface';
import { artistSearchableFields } from './Artist.constant';
import type {
  TDeleteAgent,
  TInviteAgent,
  TProcessArtistRequest,
} from './Artist.interface';
import { userOmit } from '../user/User.constant';
import { agentSearchableFields } from '../agent/Agent.constant';

/**
 * All artist related services
 */
export const ArtistServices = {
  /**
   * Retrieve all artist list
   *
   * @param {TList} { limit, page, search }
   */
  async getArtistList({ limit, page, search }: TList) {
    const where: Prisma.UserWhereInput = {
      role: EUserRole.ARTIST,
    };

    //? Search artist using searchable fields
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
      //? exclude unnecessary fields
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

  /**
   * Invite an agent for an artist
   *
   * @param {TInviteAgent} { agent_id, artist }
   */
  async inviteAgent({ agent_id, artist }: TInviteAgent) {
    //? ensure that the agent does not exist
    if (artist.artist_agents.includes(agent_id)) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You already have this agent',
      );
    }

    //? if agent is already in artist pending list then approve request
    if (artist.artist_pending_agents.includes(agent_id)) {
      return this.processArtistRequest({
        is_approved: true,
        agent_id,
        artist,
      });
    }

    const agent = await prisma.user.findUnique({
      where: { id: agent_id, role: EUserRole.AGENT },
      //? skip unnecessary fields
      select: {
        agent_pending_artists: true,
      },
    });

    if (!agent) {
      throw new ServerError(StatusCodes.NOT_FOUND, 'Agent not found');
    }

    //? ensure that the agent had not sent request to this artist before
    if (agent.agent_pending_artists.includes(artist.id)) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'You have already sent request to this artist',
      );
    }

    await prisma.user.update({
      where: { id: agent_id },
      data: {
        //? append artist to agent pending list
        agent_pending_artists: { push: artist.id },
      },
      select: { id: true }, //? skip body
    });
  },

  /**
   * Approve or reject artist request from agent
   *
   * @param {TProcessArtistRequest} { agent_id, is_approved, artist }
   */
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

    //? use transaction to update both artist and agent at the same time
    await prisma.$transaction(async tx => {
      if (is_approved) {
        //? append agent to artist list
        artistData.artist_agents = { push: agent_id };

        //? update into agent
        await tx.user.update({
          where: { id: agent_id },
          data: {
            //? append artist to agent list
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
    artist_agents: TUser['artist_agents'],
    { limit, page, search }: TList,
  ) {
    const agentWhere: Prisma.UserWhereInput = {
      id: { in: artist_agents },
      role: EUserRole.AGENT,
    };

    //? Search agent using searchable fields
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

  /**
   * Delete agent from artist list
   *
   * @param {TDeleteAgent} { agent_id, artist }
   */
  async deleteAgent({ agent_id, artist }: TDeleteAgent) {
    //? use transaction to update both artist and agent at the same time
    await prisma.$transaction(async tx => {
      //? update into artist
      await tx.user.update({
        where: { id: artist.id },
        data: {
          artist_agents: {
            //? remove agent from artist list
            set: artist.artist_agents.filter(id => id !== agent_id),
          },
        },
        select: { id: true }, //? skip body
      });

      const agent = await tx.user.findUnique({
        where: { id: agent_id },
        //? skip unnecessary fields
        select: {
          agent_artists: true,
        },
      });

      //? update into agent
      await tx.user.update({
        where: { id: agent_id },
        data: {
          agent_artists: {
            //? remove artist from agent list
            set: agent!.agent_artists.filter(id => id !== artist.id),
          },
        },
        select: { id: true }, //? skip body
      });
    });
  },
};
