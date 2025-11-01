import { Prisma, prisma } from '../../../utils/db';
import { TPagination } from '../../../utils/server/serveResponse';
import { TGetAgentOffersForOrganizerArgs } from './Organizer.interface';

export const OrganizerServices = {
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
      where.OR = [
        { agent: { name: { contains: search, mode: 'insensitive' } } },
      ];
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
