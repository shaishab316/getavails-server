import { Router } from 'express';
import { injectRoutes } from '../../../utils/router/injectRouter';
import { ArtistRoutes } from '../artist/Artist.route';
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

const artist = Router();
{
  artist.post(
    '/invite-agent',
    purifyRequest(AgentValidations.inviteAgent),
    AgentControllers.inviteAgent,
  );
}

const agent = injectRoutes(Router(), {
  '/artists': [ArtistRoutes.agent],
});
{
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
}

export const AgentRoutes = { agent, free, artist };
