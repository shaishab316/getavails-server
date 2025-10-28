import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { ArtistControllers } from './Artist.controller';
import { ArtistValidations } from './Artist.validation';

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

const artist = Router();
{
  artist.post(
    '/approve-agent',
    purifyRequest(ArtistValidations.processAgentRequest),
    ArtistControllers.processAgentRequest(true),
  );

  artist.post(
    '/reject-agent',
    purifyRequest(ArtistValidations.processAgentRequest),
    ArtistControllers.processAgentRequest(false),
  );
}

export const ArtistRoutes = { free, agent, artist };
