import catchAsync from '../../middlewares/catchAsync';
import { EventServices } from './Event.service';

/**
 * All event related controllers
 */
export const EventControllers = {
  /**
   * Create new event
   */
  createEvent: catchAsync(async ({ body, user: organizer }) => {
    const event = await EventServices.createEvent({
      ...body,
      organizer_id: organizer.id,
    });

    return {
      message: 'Event created successfully!',
      data: event,
    };
  }),
};
