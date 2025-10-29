import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { ArtistControllers } from './Artist.controller';
import { ArtistValidations } from './Artist.validation';
import { AgentValidations } from '../agent/Agent.validation';
import { AgentControllers } from '../agent/Agent.controller';

const free = Router();
{
  free.get(
    '/',
    purifyRequest(QueryValidations.list),
    ArtistControllers.getArtistList,
  );
}

const artist = Router();
{
  artist.get(
    '/agents',
    purifyRequest(QueryValidations.list),
    ArtistControllers.getMyAgentList,
  );

  artist.post(
    '/invite-agent',
    purifyRequest(AgentValidations.inviteAgent),
    AgentControllers.inviteAgent,
  );

  artist.post(
    '/approve-agent',
    purifyRequest(ArtistValidations.processArtistRequest),
    ArtistControllers.processArtistRequest(true),
  );

  artist.post(
    '/reject-agent',
    purifyRequest(ArtistValidations.processArtistRequest),
    ArtistControllers.processArtistRequest(false),
  );
}

export const ArtistRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/artists/
   */
  free,

  /**
   * Only artists can access
   *
   * @url : (base_url)/artist/agents/
   */
  artist,
};
