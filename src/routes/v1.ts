import { Router } from 'express';
import auth from '../app/middlewares/auth';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { injectRoutes } from '../utils/router/injectRouter';
import { ArtistRoutes } from '../app/modules/artist/Artist.route';
import { AgentRoutes } from '../app/modules/agent/Agent.route';
import { VenueRoutes } from '../app/modules/venue/Venue.route';
import { ChatRoutes } from '../app/modules/chat/Chat.route';
import { MessageRoutes } from '../app/modules/message/Message.route';
import { OrganizerRoutes } from '../app/modules/organizer/Organizer.route';

export default injectRoutes(Router(), {
  // no auth required
  '/auth': [AuthRoutes.free],
  '/artists': [ArtistRoutes.free],
  '/agents': [AgentRoutes.free],

  // all user can access
  '/profile': [auth.all, UserRoutes.all],
  '/inbox': [auth.all, ChatRoutes.all],
  '/messages': [auth.all, MessageRoutes.all],

  // venue can access
  '/venue': [auth.venue, VenueRoutes.venue],

  // agent can access
  '/agent': [auth.agent, AgentRoutes.agent],

  // artist can access
  '/artist': [auth.artist, ArtistRoutes.artist],

  //organizer can access
  '/organizer': [auth.organizer, OrganizerRoutes.organizer],

  // only admin can access
  '/admin': [auth.admin, AdminRoutes.admin],
});
