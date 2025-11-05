import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EAgentOfferStatus, Prisma, prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { agentOfferSearchableFields } from '../agent/Agent.constant';
import type {
  TAcceptAgentOfferArgs,
  TAcceptAgentOfferMetadata,
  TAcceptVenueOfferArgs,
  TAcceptVenueOfferMetadata,
  TGetActiveVenues,
  TGetAgentOffersForOrganizerArgs,
  TGetVenueOffersForOrganizerArgs,
} from './Organizer.interface';
import { stripe } from '../payment/Payment.utils';
import config from '../../../config';
import { userOmit, userSearchableFields } from '../user/User.constant';

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
            product_data: { name: offer_id, metadata },
            unit_amount: Math.ceil(amount * 100),
          },
          quantity: 1,
        },
      ],
      payment_method_types: config.payment.stripe.methods,
      success_url: config.url.payment_success,
      cancel_url: config.url.payment_failure,
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
            product_data: { name: offer_id, metadata },
            unit_amount: Math.ceil(amount * 100),
          },
          quantity: 1,
        },
      ],
      payment_method_types: config.payment.stripe.methods,
      success_url: config.url.payment_success,
      cancel_url: config.url.payment_failure,
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
          ...venue,
          start_date,
          end_date,
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
};
