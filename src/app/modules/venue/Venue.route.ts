import { Router } from 'express';
import { VenueControllers } from './Venue.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { VenueValidations } from './Venue.validation';

const venue = Router();
{
  venue.get('/', VenueControllers.getMyVenue);

  venue.patch(
    '/edit',
    purifyRequest(VenueValidations.updateVenue),
    VenueControllers.updateVenue,
  );
}

export const VenueRoutes = { venue };
