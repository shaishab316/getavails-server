import { Prisma, prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { agentOfferSearchableFields } from '../agent/Agent.constant';
import type { TGetAgentOffersForOrganizerArgs } from './Organizer.interface';

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
};
