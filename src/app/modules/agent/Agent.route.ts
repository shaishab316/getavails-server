import { Router } from 'express';
import { injectRoutes } from '../../../utils/router/injectRouter';
import { ArtistRoutes } from '../artist/Artist.route';
import { AgentControllers } from './Agent.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';

const free = Router();
{
  free.get(
    '/',
    purifyRequest(QueryValidations.list),
    AgentControllers.getAgentList,
  );
}

const agent = injectRoutes(Router(), {
  '/artists': [ArtistRoutes.agent],
});

export const AgentRoutes = { agent, free };
