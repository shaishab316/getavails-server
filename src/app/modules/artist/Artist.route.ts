import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { ArtistControllers } from './Artist.controller';

const all = Router();
{
  all.get(
    '/',
    purifyRequest(QueryValidations.list),
    ArtistControllers.getAllArtists,
  );
}

export const ArtistRoutes = { all };
