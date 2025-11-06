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
    const lastEvent = await prisma.event.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    return prisma.event.create({
      data: {
        ...payload,
        id: `ev-${lastEvent ? +lastEvent.id.split('-')[1] + 1 : 1}`,
        end_date: payload.end_date ?? payload.start_date,
        available_capacity: payload.capacity,
      },
    });
  },
};
