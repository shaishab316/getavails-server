import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EVenueOfferStatus, Prisma, prisma } from '../../../utils/db';
import { userOmit, userSearchableFields } from '../user/User.constant';
import type {
  TCancelVenueOfferArgs,
  TGetVenueOffersArgs,
  TUpdateVenueArgs,
  TVenueCreateOfferArgs,
} from './Venue.interface';
import { TPagination } from '../../../utils/server/serveResponse';
import { months } from '../../../constants/month';

/**
 * All venue related services
 */
export const VenueServices = {
  /**
   * Update venue information
   */
  async updateVenue({ venue_id, ...payload }: TUpdateVenueArgs) {
    return prisma.user.update({
      where: { id: venue_id },
      data: payload,
      //? skip unnecessary fields
      omit: userOmit.VENUE,
    });
  },

  /**
   * Create new agent offer
   */
  async createOffer(payload: TVenueCreateOfferArgs) {
    //? ensure that start date is before end date
    if (!payload.end_date) {
      payload.end_date = payload.start_date;
    }

    return prisma.venueOffer.create({
      data: payload,
    });
  },

  /**
   * Cancel agent offer
   */
  async cancelOffer({
    offer_id,
    venue_id,
    organizer_id,
  }: TCancelVenueOfferArgs) {
    const offer = await prisma.venueOffer.findFirst({
      where: { id: offer_id, venue_id, organizer_id },
    });

    if (!offer) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to cancel this offer',
      );
    }

    if (offer.status === EVenueOfferStatus.CANCELLED) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'This offer is already cancelled',
      );
    }

    return prisma.venueOffer.update({
      where: { id: offer_id },
      data: { status: EVenueOfferStatus.CANCELLED, cancelled_at: new Date() },
    });
  },

  /**
   * Get all agent offers
   */
  async getMyOffers({
    limit,
    page,
    status,
    venue_id,
    search,
  }: TGetVenueOffersArgs) {
    const where: Prisma.VenueOfferWhereInput = {
      venue_id,
      status,
    };

    //? Search agent using searchable fields
    if (search) {
      where.organizer = Object.fromEntries(
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
        organizer: {
          //? exclude unnecessary fields
          omit: userOmit.ORGANIZER,
        },
      },
      omit: {
        venue_id: true,
        organizer_id: true,
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
   * Get venue overview
   */
  async getVenueOverview(venue_id: string) {
    const currentYear = new Date().getFullYear();
    const yearStartDate = new Date(`${currentYear}-01-01`);
    const yearEndDate = new Date(`${currentYear}-12-31T23:59:59`);

    // Parallel execution for better performance
    const [venueOfferSummary, bookingCountsByMonth, monthlyRevenueCounts] =
      await Promise.all([
        // Revenue and booking aggregation
        prisma.venueOffer.aggregate({
          where: {
            venue_id: venue_id,
            status: EVenueOfferStatus.APPROVED,
          },
          _sum: {
            amount: true,
          },
          _count: {
            id: true,
          },
        }),

        // Monthly booking counts using raw query (most efficient)
        prisma.$queryRaw<Array<{ month: number; count: bigint }>>`
        SELECT 
          EXTRACT(MONTH FROM approved_at)::int as month,
          COUNT(*)::bigint as count
        FROM venue_offers
        WHERE venue_id = ${venue_id}
          AND status = 'APPROVED'
          AND approved_at >= ${yearStartDate}
          AND approved_at <= ${yearEndDate}
        GROUP BY EXTRACT(MONTH FROM approved_at)
        ORDER BY month
      `,

        // Monthly revenue from approved bookings
        prisma.$queryRaw<Array<{ month: number; revenue: number }>>`
        SELECT 
          EXTRACT(MONTH FROM approved_at)::int as month,
          COALESCE(SUM(amount), 0)::float as revenue
        FROM venue_offers
        WHERE venue_id = ${venue_id}
          AND status = 'APPROVED'
          AND approved_at >= ${yearStartDate}
          AND approved_at <= ${yearEndDate}
        GROUP BY EXTRACT(MONTH FROM approved_at)
        ORDER BY month
      `,
      ]);

    const totalRevenue = venueOfferSummary._sum.amount || 0;
    const totalBookings = venueOfferSummary._count.id || 0;

    // Create maps for O(1) lookups
    const monthToBookingCountMap = new Map(
      bookingCountsByMonth.map(({ month, count }) => [month, Number(count)]),
    );

    const monthToRevenueMap = new Map(
      monthlyRevenueCounts.map(({ month, revenue }) => [
        month,
        Number(revenue),
      ]),
    );

    // Generate all 12 months with booking counts
    const monthlyBookingStatistics = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return {
        month: months[index],
        bookingCount: monthToBookingCountMap.get(monthNumber) || 0,
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
      totalBookings,
      monthlyBookingStatistics,
      monthlyRevenueStatistics,
    };
  },
};
