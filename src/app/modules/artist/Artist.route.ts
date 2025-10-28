import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { ArtistControllers } from './Artist.controller';
import { ArtistValidations } from './Artist.validation';

const all = Router();
{
  all.get(
    '/',
    purifyRequest(QueryValidations.list),
    ArtistControllers.getAllArtists,
  );
}

const agent = Router();
{
  agent.post(
    '/request',
    purifyRequest(ArtistValidations.sentRequestToArtist),
    ArtistControllers.sentRequestToArtist,
  );
}

export const ArtistRoutes = { all, agent };
