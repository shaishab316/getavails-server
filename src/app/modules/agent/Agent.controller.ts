import catchAsync from '../../middlewares/catchAsync';
import { AgentServices } from './Agent.service';

export const AgentControllers = {
  getAgentList: catchAsync(async ({ query }) => {
    const { meta, agents } = await AgentServices.getAgentList(query);

    return {
      message: 'Agents retrieved successfully!',
      meta,
      data: agents,
    };
  }),
};
