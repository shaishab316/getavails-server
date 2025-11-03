import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EAgentOfferStatus, Prisma, prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { agentOfferSearchableFields } from '../agent/Agent.constant';
import type {
  TAcceptAgentOfferArgs,
  TAcceptAgentOfferMetadata,
  TGetAgentOffersForOrganizerArgs,
} from './Organizer.interface';
import { stripe } from '../payment/Payment.utils';
import config from '../../../config';

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
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      } satisfies TPagination,
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
};
