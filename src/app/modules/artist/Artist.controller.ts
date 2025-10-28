import catchAsync from '../../middlewares/catchAsync';
import { ArtistServices } from './Artist.service';

export const ArtistControllers = {
  getAllArtists: catchAsync(async ({ query }) => {
    const { meta, artists } = await ArtistServices.getAllArtists(query);

    return {
      message: 'Artists retrieved successfully!',
      meta,
      data: artists,
    };
  }),

  sentRequestToArtist: catchAsync(async ({ body, user }) => {
    await ArtistServices.sentRequestToArtist({
      agent_id: user.id,
      ...body,
    });

    return {
      message: 'Request sent successfully!',
    };
  }),
};
