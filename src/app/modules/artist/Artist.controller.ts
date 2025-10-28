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
      agent_id: user.id,
      ...body,
    });

    return {
      message: 'Artist invited successfully!',
    };
  }),

  processAgentRequest: (is_approved: boolean) =>
    catchAsync(async ({ body, user }) => {
      await ArtistServices.processAgentRequest({
        ...body,
        artist_id: user.id,
        is_approved,
      });

      return {
        message: `${is_approved ? 'Approved' : 'Rejected'} successfully!`,
      };
    }),
};
