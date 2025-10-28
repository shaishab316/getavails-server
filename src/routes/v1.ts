import { Router } from 'express';
import auth from '../app/middlewares/auth';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { injectRoutes } from '../utils/router/injectRouter';
import { ArtistRoutes } from '../app/modules/artist/Artist.route';
import { AgentRoutes } from '../app/modules/agent/Agent.route';

export default injectRoutes(Router(), {
  // no auth required
  '/auth': [AuthRoutes.free],
  '/artists': [auth.all, ArtistRoutes.free],

  // all user can access
  '/profile': [auth.all, UserRoutes.all],

  // venue can access
  '/venue': [auth.venue, UserRoutes.venue],

  // agent can access
  '/agent': [auth.agent, AgentRoutes.agent],

  // only admin can access
  '/admin': [auth.admin, AdminRoutes.admin],
});
