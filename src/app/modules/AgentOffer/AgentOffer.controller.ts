import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../middlewares/catchAsync';
import { AgentOfferServices } from './AgentOffer.service';

/**
 * All agent offer related controllers
 */
export const AgentOfferControllers = {
  /**
   * Create new agent offer
   */
  createOffer: catchAsync(async ({ body, user: agent }) => {
    const offer = await AgentOfferServices.createOffer({
      ...body,
      agent_id: agent.id,
    });

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Offer created successfully!',
      data: offer,
    };
  }),
};
