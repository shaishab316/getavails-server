import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import catchAsync from '../../middlewares/catchAsync';
import { ArtistServices } from './Artist.service';

export const ArtistControllers = {
  getArtistList: catchAsync(async ({ query }) => {
    const { meta, artists } = await ArtistServices.getArtistList(query);

    return {
      message: 'Artists retrieved successfully!',
      meta,
      data: artists,
    };
  }),

  inviteAgent: catchAsync(async ({ body, user: artist }) => {
    await ArtistServices.inviteAgent({
      agent_id: body.agent_id,
      artist,
    });

    return {
      message: 'Agent invited successfully!',
    };
  }),

  processArtistRequest: (is_approved: boolean) =>
    catchAsync(async ({ body, user: artist }) => {
      if (!artist.artist_pending_agents.includes(body.agent_id)) {
        throw new ServerError(
          StatusCodes.NOT_FOUND,
          'Agent not found in pending list',
        );
      }

      await ArtistServices.processArtistRequest({
        artist,
        is_approved,
        agent_id: body.agent_id,
      });

      return {
        message: `${is_approved ? 'Approved' : 'Rejected'} successfully!`,
      };
    }),

  getMyAgentList: catchAsync(async ({ user, query }) => {
    const { meta, agents } = await ArtistServices.getMyAgentList(user, query);

    return {
      message: 'Agents retrieved successfully!',
      meta,
      data: agents,
    };
  }),
};
