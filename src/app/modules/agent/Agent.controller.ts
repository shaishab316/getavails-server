import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import catchAsync from '../../middlewares/catchAsync';
import { AgentServices } from './Agent.service';

export const AgentControllers = {
  getAgentList: catchAsync(async ({ query }) => {
    const { meta, agents } = await AgentServices.getAgentList(query);

    return {
      message: 'Agents retrieved successfully!',
      meta,
      data: agents,
    };
  }),

  inviteArtist: catchAsync(async ({ body, user: agent }) => {
    await AgentServices.inviteArtist({
      artist_id: body.artist_id,
      agent,
    });

    return {
      message: 'Artist invited successfully!',
    };
  }),

  processAgentRequest: (is_approved: boolean) =>
    catchAsync(async ({ body, user: agent }) => {
      if (!agent.agent_pending_artists.includes(body.artist_id)) {
        throw new ServerError(
          StatusCodes.NOT_FOUND,
          'Artist not found in pending list',
        );
      }

      await AgentServices.processAgentRequest({
        agent,
        is_approved,
        artist_id: body.artist_id,
      });

      return {
        message: `${is_approved ? 'Approved' : 'Rejected'} successfully!`,
      };
    }),

  getMyArtistList: catchAsync(async ({ query, user }) => {
    const { meta, artists } = await AgentServices.getMyArtistList(user, query);

    return {
      message: 'Artists retrieved successfully!',
      meta,
      data: artists,
    };
  }),
};
