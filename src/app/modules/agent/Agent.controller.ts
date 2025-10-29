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

  inviteAgent: catchAsync(async ({ body, user }) => {
    await AgentServices.inviteAgent({
      ...body,
      artist_id: user.id,
    });

    return {
      message: 'Agent invited successfully!',
    };
  }),

  processAgentRequest: (is_approved: boolean) =>
    catchAsync(async ({ body, user }) => {
      await AgentServices.processAgentRequest({
        ...body,
        is_approved,
        agent_id: user.id,
      });

      return {
        message: `${is_approved ? 'Approved' : 'Rejected'} successfully!`,
      };
    }),
};
