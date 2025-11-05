import { Router } from 'express';
import { EventControllers } from './Event.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { EventValidations } from './Event.validation';
import capture from '../../middlewares/capture';

const organizer = Router();
{
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

export const EventRoutes = {
  /**
   * Only organizer can access
   *
   * @url : (base_url)/organizer/events/
   */
  organizer,
};
