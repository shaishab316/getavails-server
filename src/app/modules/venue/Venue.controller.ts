import catchAsync from '../../middlewares/catchAsync';
import { VenueServices } from './Venue.service';

export const VenueControllers = {
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
