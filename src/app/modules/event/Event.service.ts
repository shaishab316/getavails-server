import { Prisma, prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { eventSearchableField } from './Event.constant';
import { TCreateEvent, TGetMyUpcomingEvent } from './Event.interface';

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

  /**
   * Get my upcoming events
   */
  async getMyUpcomingEvent({
    limit,
    page,
    search,
    user_id,
  }: TGetMyUpcomingEvent) {
    const ticketWhere: Prisma.TicketWhereInput = {
      user_id,
      event: {
        start_date: {
          gte: new Date(),
        },
      },
    };

    if (search) {
      ticketWhere.event!.OR = eventSearchableField.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const tickets = await prisma.ticket.findMany({
      where: ticketWhere,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        event: {
          start_date: 'desc',
        },
      },
      select: {
        event: {
          include: {
            organizer: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      distinct: ['event_id'],
    });

    const events = tickets.flatMap(({ event }) => event);

    const total = await prisma.ticket.count({
      where: ticketWhere,
    });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
      events,
    };
  },
};
