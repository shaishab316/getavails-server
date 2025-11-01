import { prisma } from '../../../utils/db';
import { TCreateAgentOfferArgs } from './AgentOffer.interface';

/**
 * All agent offer related services
 */
export const AgentOfferServices = {
  /**
   * Create new agent offer
   */
  async createOffer(payload: TCreateAgentOfferArgs) {
    return prisma.agentOffer.create({
      data: {
        ...payload,
        end_date: payload.end_date ?? payload.start_date,
      },
    });
  },
};
