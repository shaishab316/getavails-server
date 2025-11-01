import { Router } from 'express';
import { OrganizerControllers } from './Organizer.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { OrganizerValidations } from './Organizer.validation';

const organizer = Router();
{
  organizer.get(
    '/agent-offers',
    purifyRequest(QueryValidations.list, OrganizerValidations.getAgentOffers),
    OrganizerControllers.getAgentOffers,
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
