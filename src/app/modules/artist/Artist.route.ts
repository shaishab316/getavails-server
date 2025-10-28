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

export const ArtistRoutes = { free, agent };
