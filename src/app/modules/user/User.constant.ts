import { EUserRole, Prisma, User as TUser } from '../../../utils/db';

export const userSearchableFields = ['name', 'email'] satisfies (keyof TUser)[];

const selfOmit = {
  password: true,
  otp_id: true,
  stripe_account_id: true,
} satisfies Prisma.UserOmit;

export const userDefaultOmit = {
  email: true,
  is_verified: true,
  is_active: true,
  is_admin: true,
  updated_at: true,
  created_at: true,
  ballance: true,
  is_stripe_connected: true,
} satisfies Prisma.UserOmit;

export const userUserOmit = {
  ...selfOmit,
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
  ...selfOmit,
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
  ...selfOmit,
  genre: true,
  artist_agents: true,
  artist_pending_agents: true,
  organizer_venues: true,
  venue_type: true,
  capacity: true,
} satisfies Prisma.UserOmit;

export const userArtistOmit = {
  ...selfOmit,
  experience: true,
  agent_artists: true,
  agent_pending_artists: true,
  organizer_venues: true,
  venue_type: true,
  capacity: true,
} satisfies Prisma.UserOmit;

export const userOrganizerOmit = {
  ...selfOmit,
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

export const userSelfOmit = {
  [EUserRole.USER]: userUserOmit,
  [EUserRole.ARTIST]: userArtistOmit,
  [EUserRole.ORGANIZER]: userOrganizerOmit,
  [EUserRole.VENUE]: userVenueOmit,
  [EUserRole.AGENT]: userAgentOmit,
};

export const userOmit = {
  [EUserRole.USER]: { ...userDefaultOmit, ...userUserOmit },
  [EUserRole.ARTIST]: { ...userDefaultOmit, ...userArtistOmit },
  [EUserRole.ORGANIZER]: { ...userDefaultOmit, ...userOrganizerOmit },
  [EUserRole.VENUE]: { ...userDefaultOmit, ...userVenueOmit },
  [EUserRole.AGENT]: { ...userDefaultOmit, ...userAgentOmit },
};
