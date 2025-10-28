import { Router } from 'express';
import { injectRoutes } from '../../../utils/router/injectRouter';
import { ArtistRoutes } from '../artist/Artist.route';

const agent = injectRoutes(Router(), {
  '/artists': [ArtistRoutes.agent],
});

export const AgentRoutes = { agent };
