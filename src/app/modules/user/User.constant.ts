import { Prisma, User as TUser } from '../../../../prisma';

export const userSearchableFields: (keyof TUser)[] = ['name', 'email'];

export const userDefaultOmit: Prisma.UserOmit = {
  password: true,
};

export const userVenueOmit: Prisma.UserOmit = Object.assign(
  {
    experience: true,
    genre: true,
    availability: true,
    price: true,
  },
  userDefaultOmit,
);

export const userAgentOmit: Prisma.UserOmit = Object.assign(
  {
    genre: true,
  },
  userDefaultOmit,
);

export const userArtistOmit: Prisma.UserOmit = Object.assign(
  {
    experience: true,
  },
  userDefaultOmit,
);

export const userOrganizerOmit: Prisma.UserOmit = Object.assign(
  {
    experience: true,
    genre: true,
    availability: true,
    price: true,
  },
  userDefaultOmit,
);
