import { Router } from 'express';
import { OrganizerControllers } from './Organizer.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { OrganizerValidations } from './Organizer.validation';
import { AgentValidations } from '../agent/Agent.validation';
import { AgentControllers } from '../agent/Agent.controller';

const organizer = Router();
//? agent offers routes
{
  organizer.get(
    '/agent-offers',
    purifyRequest(QueryValidations.list, OrganizerValidations.getAgentOffers),
    OrganizerControllers.getAgentOffers,
  );

  organizer.post(
    '/cancel-agent-offer',
    purifyRequest(AgentValidations.cancelOffer),
    AgentControllers.cancelOffer,
  );

  organizer.post(
    '/accept-agent-offer',
    purifyRequest(OrganizerValidations.acceptAgentOffer),
    OrganizerControllers.acceptAgentOffer,
  );
}
//? venue offers routes
{
  organizer.get(
    '/venue-offers',
    purifyRequest(QueryValidations.list, OrganizerValidations.getVenueOffers),
    OrganizerControllers.getVenueOffers,
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
