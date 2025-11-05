import { prisma } from '../../../utils/db';
import { TCreateEvent } from './Event.interface';

/**
 * Event services
 */
export const EventServices = {
  /**
   * Create new event
   */
  async createEvent(payload: TCreateEvent) {
    return prisma.event.create({
      data: {
        ...payload,
        end_date: payload.end_date ?? payload.start_date,
      },
    });
  },
};
