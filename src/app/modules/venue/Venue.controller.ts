import catchAsync from '../../middlewares/catchAsync';
import { VenueServices } from './Venue.service';

export const VenueControllers = {
  getMyVenue: catchAsync(async ({ user }) => {
    const data = await VenueServices.getMyVenue(user.id);

    return {
      message: 'Venue retrieved successfully!',
      data,
    };
  }),

  updateVenue: catchAsync(async ({ body, user }) => {
    const data = await VenueServices.updateVenue({
      ...body,
      venue_id: user.id,
    });

    return {
      message: 'Venue updated successfully!',
      data,
    };
  }),
};
