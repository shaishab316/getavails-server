import { Router } from 'express';
import { OrganizerControllers } from './Organizer.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { OrganizerValidations } from './Organizer.validation';
import { AgentValidations } from '../agent/Agent.validation';
import { AgentControllers } from '../agent/Agent.controller';
import { VenueValidations } from '../venue/Venue.validation';
import { VenueControllers } from '../venue/Venue.controller';
import { injectRoutes } from '../../../utils/router/injectRouter';
import { EventRoutes } from '../event/Event.route';

const organizer = injectRoutes(Router(), {
  '/events': [EventRoutes.organizer],
});
//? agent offers routes
{
  /**
   * Get active venues
   */
  organizer.get(
    '/active-venues',
    purifyRequest(QueryValidations.list),
    OrganizerControllers.getActiveVenues,
  );

  /**
   * Get agent offers
   */
  organizer.get(
    '/agent-offers',
    purifyRequest(QueryValidations.list, OrganizerValidations.getAgentOffers),
    OrganizerControllers.getAgentOffers,
  );

  /**
   * Cancel agent offer
   */
  organizer.post(
    '/cancel-agent-offer',
    purifyRequest(AgentValidations.cancelOffer),
    AgentControllers.cancelOffer,
  );

  /**
   * Accept agent offer
   */
  organizer.post(
    '/accept-agent-offer',
    purifyRequest(OrganizerValidations.acceptAgentOffer),
    OrganizerControllers.acceptAgentOffer,
  );
}
//? venue offers routes
{
  /**
   * Get active artists
   */
  organizer.get(
    '/active-artists',
    purifyRequest(QueryValidations.list),
    OrganizerControllers.getActiveArtists,
  );

  /**
   * Get venue offers
   */
  organizer.get(
    '/venue-offers',
    purifyRequest(QueryValidations.list, OrganizerValidations.getVenueOffers),
    OrganizerControllers.getVenueOffers,
  );

  /**
   * Cancel venue offer
   */
  organizer.post(
    '/cancel-venue-offer',
    purifyRequest(VenueValidations.cancelOffer),
    VenueControllers.cancelOffer,
  );

  /**
   * Accept venue offer
   */
  organizer.post(
    '/accept-venue-offer',
    purifyRequest(OrganizerValidations.acceptVenueOffer),
    OrganizerControllers.acceptVenueOffer,
  );
}

export const OrganizerRoutes = {
  /**
   * Organizer can access
   *
   * @url : (base_url)/organizer/
   */
  organizer,
};
