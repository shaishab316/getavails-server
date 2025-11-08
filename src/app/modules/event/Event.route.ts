import { Router } from 'express';
import { EventControllers } from './Event.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { EventValidations } from './Event.validation';
import capture from '../../middlewares/capture';
import { QueryValidations } from '../query/Query.validation';

const organizer = Router();
{
  /**
   * get organizer events
   */
  organizer.get(
    '/',
    purifyRequest(QueryValidations.list, EventValidations.getOrganizerEvent),
    EventControllers.getOrganizerEvents,
  );

  /**
   * Create new event
   */
  organizer.post(
    '/create-event',
    capture({
      images: {
        size: 15 * 1024 * 1024,
        maxCount: 10,
        fileType: 'images',
      },
    }),
    purifyRequest(EventValidations.createEvent),
    EventControllers.createEvent,
  );
}

const all = Router();
{
  /**
   * get all available events for users
   */
  all.get(
    '/',
    purifyRequest(QueryValidations.list),
    EventControllers.getAllEvents,
  );

  /**
   * Get all upcoming events
   */
  all.get(
    '/upcoming-events',
    purifyRequest(QueryValidations.list),
    EventControllers.getUserUpcomingEvents,
  );
}

export const EventRoutes = {
  /**
   * Only organizer can access
   *
   * @url : (base_url)/organizer/events/
   */
  organizer,

  /**
   * All can access
   *
   * @url : (base_url)/events/
   */
  all,
};
