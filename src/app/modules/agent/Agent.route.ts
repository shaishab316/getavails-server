import { Router } from 'express';
import { AgentControllers } from './Agent.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { AgentValidations } from './Agent.validation';

const free = Router();
{
  free.get(
    '/',
    purifyRequest(QueryValidations.list),
    AgentControllers.getAgentList,
  );
}

const agent = Router();
{
  agent.get(
    '/artists',
    purifyRequest(QueryValidations.list),
    AgentControllers.getMyArtistList,
  );

  agent.post(
    '/invite-artist',
    purifyRequest(AgentValidations.inviteArtist),
    AgentControllers.inviteArtist,
  );

  agent.post(
    '/approve-artist',
    purifyRequest(AgentValidations.processAgentRequest),
    AgentControllers.processAgentRequest(true),
  );

  agent.post(
    '/reject-artist',
    purifyRequest(AgentValidations.processAgentRequest),
    AgentControllers.processAgentRequest(false),
  );

  agent.delete(
    '/delete-artist',
    purifyRequest(AgentValidations.deleteArtist),
    AgentControllers.deleteArtist,
  );

  agent.post(
    '/create-offer',
    purifyRequest(AgentValidations.createOffer),
    AgentControllers.createOffer,
  );

  agent.get(
    '/my-offers',
    purifyRequest(QueryValidations.list, AgentValidations.getMyOffers),
    AgentControllers.getMyOffers,
  );

  agent.post(
    '/cancel-offer',
    purifyRequest(AgentValidations.cancelOffer),
    AgentControllers.cancelOffer,
  );
}

export const AgentRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/agents/
   */
  free,

  /**
   * Only agents can access
   *
   * @url : (base_url)/agent/
   */
  agent,
};
