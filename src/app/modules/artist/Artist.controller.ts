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

  inviteArtist: catchAsync(async ({ body, user }) => {
    await ArtistServices.inviteArtist({
      ...body,
      agent_id: user.id,
    });

    return {
      message: 'Artist invited successfully!',
    };
  }),

  processArtistRequest: (is_approved: boolean) =>
    catchAsync(async ({ body, user }) => {
      await ArtistServices.processArtistRequest({
        ...body,
        artist_id: user.id,
        is_approved,
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
