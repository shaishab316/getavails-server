import catchAsync from '../../middlewares/catchAsync';
import { VenueServices } from './Venue.service';

/**
 * All venue related controllers
 */
export const VenueControllers = {
  /**
   * Update venue information
   */
  updateVenue: catchAsync(async ({ body, user: venue }) => {
    const data = await VenueServices.updateVenue({
      ...body,
      venue_id: venue.id,
    });

    return {
      message: 'Venue updated successfully!',
      data,
    };
  }),
};
