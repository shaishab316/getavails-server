import { Router } from 'express';
import { VenueValidations } from './Venue.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { VenueControllers } from './Venue.controller';

const venue = Router();
{
  venue.patch(
    '/edit',
    purifyRequest(VenueValidations.updateVenue),
    VenueControllers.updateVenue,
  );
}

export const VenueRoutes = {
  /**
   * Only venue can access
   *
   * @url : (base_url)/venue/
   */
  venue,
};
