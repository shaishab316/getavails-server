import { Router } from 'express';
import { VenueValidations } from './Venue.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { VenueControllers } from './Venue.controller';

const venue = Router();
{
  /**
   * Update venue information
   */
  venue.patch(
    '/edit',
    purifyRequest(VenueValidations.updateVenue),
    VenueControllers.updateVenue,
  );

  /**
   * Create new venue offer to organizer
   */
  venue.post(
    '/create-offer',
    purifyRequest(VenueValidations.createOffer),
    VenueControllers.createOffer,
  );

  /**
   * Cancel agent offer
   */
  venue.post(
    '/cancel-offer',
    purifyRequest(VenueValidations.cancelOffer),
    VenueControllers.cancelOffer,
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
