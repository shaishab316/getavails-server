import { EUserRole, Prisma, User as TUser } from '../../../../prisma';

export const userSearchableFields = ['name', 'email'] satisfies (keyof TUser)[];

export const userDefaultOmit = {
  password: true,
  is_verified: true,
  is_active: true,
  is_admin: true,
  updated_at: true,
  created_at: true,
} satisfies Prisma.UserOmit;

export const userUserOmit = {
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
} satisfies Prisma.UserOmit;

export const userVenueOmit = {
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
} satisfies Prisma.UserOmit;

export const userAgentOmit = {
  ...userDefaultOmit,
  genre: true,
  artist_agents: true,
  artist_pending_agents: true,
  organizer_venues: true,
  venue_type: true,
  capacity: true,
} satisfies Prisma.UserOmit;

export const userArtistOmit = {
  ...userDefaultOmit,
  experience: true,
  agent_artists: true,
  agent_pending_artists: true,
  organizer_venues: true,
  venue_type: true,
  capacity: true,
} satisfies Prisma.UserOmit;

export const userOrganizerOmit = {
  ...userDefaultOmit,
  experience: true,
  availability: true,
  price: true,
  artist_agents: true,
  artist_pending_agents: true,
  agent_artists: true,
  agent_pending_artists: true,
  venue_type: true,
  capacity: true,
} satisfies Prisma.UserOmit;

export const userOmit = {
  [EUserRole.USER]: userUserOmit,
  [EUserRole.ARTIST]: userArtistOmit,
  [EUserRole.ORGANIZER]: userOrganizerOmit,
  [EUserRole.VENUE]: userVenueOmit,
  [EUserRole.AGENT]: userAgentOmit,
};
