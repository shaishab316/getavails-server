import { EUserRole, Prisma, prisma } from '../../../utils/db';
import type { TPagination } from '../../../utils/server/serveResponse';
import { TList } from '../query/Query.interface';
import { userOmit } from '../user/User.constant';
import { agentSearchableFields } from './Agent.constant';

export const AgentServices = {
  async getAgentList({ limit, page, search }: TList) {
    const where: Prisma.UserWhereInput = {
      role: EUserRole.AGENT,
    };

    if (search) {
      where.OR = agentSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));
    }

    const agents = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      omit: userOmit.AGENT,
    });

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
      agents,
    };
  },
};
