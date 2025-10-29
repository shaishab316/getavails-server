import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { ArtistControllers } from './Artist.controller';
import { ArtistValidations } from './Artist.validation';
import { injectRoutes } from '../../../utils/router/injectRouter';
import { AgentRoutes } from '../agent/Agent.route';

const free = Router();
{
  free.get(
    '/',
    purifyRequest(QueryValidations.list),
    ArtistControllers.getArtistList,
  );
}

const agent = Router();
{
  agent.post(
    '/invite-artist',
    purifyRequest(ArtistValidations.inviteArtist),
    ArtistControllers.inviteArtist,
  );
}

const artist = injectRoutes(Router(), {
  '/agents': [AgentRoutes.artist],
});
{
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
   * Only agents can access
   *
   * @url : (base_url)/agent/artists/
   */
  agent,

  /**
   * Only artists can access
   *
   * @url : (base_url)/artist/agents/
   */
  artist,
};
