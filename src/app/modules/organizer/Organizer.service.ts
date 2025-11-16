import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import {
  EAgentOfferStatus,
  ETicketStatus,
  type Prisma,
  prisma,
} from '../../../utils/db';
import type { TPagination } from '../../../utils/server/serveResponse';
import { agentOfferSearchableFields } from '../agent/Agent.constant';
import type {
  TAcceptAgentOfferArgs,
  TAcceptAgentOfferMetadata,
  TAcceptVenueOfferArgs,
  TAcceptVenueOfferMetadata,
  TGetActiveArtists,
  TGetActiveVenues,
  TGetAgentOffersForOrganizerArgs,
  TGetVenueOffersForOrganizerArgs,
} from './Organizer.interface';
import { stripe } from '../payment/Payment.utils';
import config from '../../../config';
import { userOmit, userSearchableFields } from '../user/User.constant';
import { months } from '../../../constants/month';

/**
 * All organizer related services
 */
export const OrganizerServices = {
  /**
   * Get agent offers
   */
  async getAgentOffers({
    limit,
    page,
    search,
    organizer_id,
    status,
  }: TGetAgentOffersForOrganizerArgs) {
    const where: Prisma.AgentOfferWhereInput = {
      status,
      organizer_id,
    };

    //? Search agent using searchable fields
    if (search) {
      where.OR = agentOfferSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const offers = await prisma.agentOffer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await prisma.agentOffer.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
      offers,
    };
  },

  /**
   * Accept agent offer
   */
  async acceptAgentOffer({ offer_id, organizer_id }: TAcceptAgentOfferArgs) {
    const offer = await prisma.agentOffer.findFirst({
      where: { id: offer_id, organizer_id },
      select: {
        artist: {
          select: {
            name: true,
          },
        },
        status: true,
        amount: true,
      },
    });

    if (!offer) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to accept this offer',
      );
    }

    //? ensure offer is pending
    if (offer.status !== EAgentOfferStatus.PENDING) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        `You can't accept ${offer.status} offers`,
      );
    }

    const { amount } = offer;

    const metadata: TAcceptAgentOfferMetadata = {
      purpose: 'agent_offer',
      amount: amount.toString(),
      offer_id,
    };

    const { url } = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata,
      line_items: [
        {
          price_data: {
            currency: config.payment.currency,
            product_data: {
              name: `Booking for ${offer.artist.name}`,
              metadata,
            },
            unit_amount: Math.ceil(amount * 100),
          },
          quantity: 1,
        },
      ],
      payment_method_types: config.payment.stripe.methods,
      success_url: config.url.payment.success_callback,
      cancel_url: config.url.payment.cancel_callback,
    });

    if (!url) {
      throw new ServerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create checkout session',
      );
    }

    return {
      url,
      amount,
    };
  },

  /**
   * Get venue offers
   */
  async getVenueOffers({
    limit,
    page,
    organizer_id,
    status,
    search,
  }: TGetVenueOffersForOrganizerArgs) {
    const where: Prisma.VenueOfferWhereInput = {
      status,
      organizer_id,
    };

    //? Search agent using searchable fields
    if (search) {
      where.venue = Object.fromEntries(
        userSearchableFields.map(field => [
          field,
          {
            contains: search,
            mode: 'insensitive',
          },
        ]),
      );
    }

    const offers = await prisma.venueOffer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        venue: {
          omit: userOmit.VENUE,
        },
      },
      omit: {
        organizer_id: true,
        venue_id: true,
      },
    });

    const total = await prisma.venueOffer.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
      offers,
    };
  },

  /**
   * Accept venue offer
   */
  async acceptVenueOffer({ offer_id, organizer_id }: TAcceptVenueOfferArgs) {
    const offer = await prisma.venueOffer.findFirst({
      where: { id: offer_id, organizer_id },
      select: {
        venue: {
          select: {
            name: true,
          },
        },
        status: true,
        amount: true,
      },
    });

    if (!offer) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to accept this offer',
      );
    }

    //? ensure offer is pending
    if (offer.status !== EAgentOfferStatus.PENDING) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        `You can't accept ${offer.status} offers`,
      );
    }

    const { amount } = offer;

    const metadata: TAcceptVenueOfferMetadata = {
      purpose: 'venue_offer',
      amount: amount.toString(),
      offer_id,
    };

    const { url } = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata,
      line_items: [
        {
          price_data: {
            currency: config.payment.currency,
            product_data: { name: `Booking for ${offer.venue.name}`, metadata },
            unit_amount: Math.ceil(amount * 100),
          },
          quantity: 1,
        },
      ],
      payment_method_types: config.payment.stripe.methods,
      success_url: config.url.payment.success_callback,
      cancel_url: config.url.payment.cancel_callback,
    });

    if (!url) {
      throw new ServerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create checkout session',
      );
    }

    return {
      url,
      amount,
    };
  },

  /**
   * Get active venues
   */
  async getActiveVenues({
    limit,
    page,
    search,
    organizer_id,
  }: TGetActiveVenues) {
    const where: Prisma.UserWhereInput = {
      id: organizer_id,
    };

    //? Search venue using searchable fields
    if (search) {
      where.organizer_active_venues = {
        some: {
          venue: {
            OR: userSearchableFields.map(field => ({
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            })),
          },
        },
      };
    }

    const organizers = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        organizer_active_venues: {
          select: {
            venue: { omit: userOmit.VENUE },
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    //? formate venues data
    const venues = organizers.flatMap(organizer =>
      organizer.organizer_active_venues.map(
        ({ end_date, start_date, venue }) => ({
          start_date,
          end_date,
          ...venue, //? should be last for avoid overriding
        }),
      ),
    );

    const total = await prisma.user.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
      venues,
    };
  },

  /**
   * Get active artists
   */
  async getActiveArtists({
    limit,
    page,
    search,
    organizer_id,
  }: TGetActiveArtists) {
    const where: Prisma.UserWhereInput = {
      id: organizer_id,
    };

    //? Search venue using searchable fields
    if (search) {
      where.organizer_active_artists = {
        some: {
          artist: {
            OR: userSearchableFields.map(field => ({
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            })),
          },
        },
      };
    }

    const organizers = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        organizer_active_artists: {
          select: {
            start_date: true,
            end_date: true,
            location: true,
            artist: { omit: userOmit.ARTIST },
            agent: { omit: userOmit.AGENT },
          },
        },
      },
    });

    const total = await prisma.user.count({ where });

    //? formate venues data
    const artists = organizers.flatMap(organizer =>
      organizer.organizer_active_artists.map(
        ({ end_date, start_date, artist, location, agent }) => ({
          start_date,
          end_date,
          booking_location: location,
          agent,
          ...artist, //? should be last for avoid overriding
        }),
      ),
    );

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } satisfies TPagination,
      },
      artists,
    };
  },

  /**
   * Get organizer overview
   */
  async getOrganizerOverview(organizer_id: string) {
    const currentYear = new Date().getFullYear();
    const yearStartDate = new Date(`${currentYear}-01-01`);
    const yearEndDate = new Date(`${currentYear}-12-31T23:59:59`);

    // Parallel execution for better performance
    const [ticketRevenueSummary, eventCountsByMonth, monthlyRevenueCounts] =
      await Promise.all([
        // Revenue and ticket aggregation
        prisma.ticket.aggregate({
          where: {
            event: {
              organizer_id,
            },
            status: ETicketStatus.PAID,
          },
          _sum: {
            price: true,
          },
          _count: {
            id: true,
          },
        }),

        // Monthly event counts using raw query (most efficient)
        prisma.$queryRaw<{ month: number; count: bigint }[]>`
        SELECT 
          EXTRACT(MONTH FROM created_at)::int as month,
          COUNT(*)::bigint as count
        FROM events
        WHERE organizer_id = ${organizer_id}
          AND created_at >= ${yearStartDate}
          AND created_at <= ${yearEndDate}
        GROUP BY EXTRACT(MONTH FROM created_at)
        ORDER BY month
      `,

        // Monthly revenue from paid tickets
        prisma.$queryRaw<{ month: number; revenue: number }[]>`
        SELECT 
          EXTRACT(MONTH FROM t.created_at)::int as month,
          COALESCE(SUM(t.price), 0)::float as revenue
        FROM tickets t
        INNER JOIN events e ON t.event_id = e.id
        WHERE e.organizer_id = ${organizer_id}
          AND t.status = 'PAID'
          AND t.created_at >= ${yearStartDate}
          AND t.created_at <= ${yearEndDate}
        GROUP BY EXTRACT(MONTH FROM t.created_at)
        ORDER BY month
      `,
      ]);

    const totalRevenue = ticketRevenueSummary._sum.price || 0;
    const totalBookedTickets = ticketRevenueSummary._count.id || 0;

    // Create maps for O(1) lookups
    const monthToEventCountMap = new Map(
      eventCountsByMonth.map(({ month, count }) => [month, Number(count)]),
    );

    const monthToRevenueMap = new Map(
      monthlyRevenueCounts.map(({ month, revenue }) => [
        month,
        Number(revenue),
      ]),
    );

    // Generate all 12 months with counts and month names
    const monthlyEventStatistics = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return {
        month: months[index],
        eventCount: monthToEventCountMap.get(monthNumber) || 0,
      };
    });

    // Generate all 12 months with revenue
    const monthlyRevenueStatistics = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return {
        month: months[index],
        revenue: monthToRevenueMap.get(monthNumber) || 0,
      };
    });

    return {
      totalRevenue,
      totalBookedTickets,
      monthlyEventStatistics,
      monthlyRevenueStatistics,
    };
  },
};
