import { EUserRole, Prisma, User as TUser } from '../../../../prisma';

export const userSearchableFields: (keyof TUser)[] = ['name', 'email'];

export const userDefaultOmit: Prisma.UserOmit = {
  password: true,
};

export const userUserOmit: Prisma.UserOmit = {
  ...userDefaultOmit,
  experience: true,
  genre: true,
  availability: true,
  price: true,
  location: true,
  agent_artists: true,
  agent_pending_artists: true,
  artist_agents: true,
  artist_pending_agents: true,
  organizer_venues: true,
  venue_type: true,
  capacity: true,
};

export const userVenueOmit: Prisma.UserOmit = {
  ...userDefaultOmit,
  experience: true,
  genre: true,
  availability: true,
  price: true,
  agent_artists: true,
  agent_pending_artists: true,
  artist_agents: true,
  artist_pending_agents: true,
  organizer_venues: true,
};

export const userAgentOmit: Prisma.UserOmit = {
  ...userDefaultOmit,
  genre: true,
  artist_agents: true,
  artist_pending_agents: true,
  organizer_venues: true,
  venue_type: true,
  capacity: true,
};

export const userArtistOmit: Prisma.UserOmit = {
  ...userDefaultOmit,
  experience: true,
  agent_artists: true,
  agent_pending_artists: true,
  organizer_venues: true,
  venue_type: true,
  capacity: true,
};

export const userOrganizerOmit: Prisma.UserOmit = {
  ...userDefaultOmit,
  experience: true,
  genre: true,
  availability: true,
  price: true,
  artist_agents: true,
  artist_pending_agents: true,
  agent_artists: true,
  agent_pending_artists: true,
  venue_type: true,
  capacity: true,
};

export const userOmit = {
  [EUserRole.USER]: userUserOmit,
  [EUserRole.ARTIST]: userArtistOmit,
  [EUserRole.ORGANIZER]: userOrganizerOmit,
  [EUserRole.VENUE]: userVenueOmit,
  [EUserRole.AGENT]: userAgentOmit,
};
