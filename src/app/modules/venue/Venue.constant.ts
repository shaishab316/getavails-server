import { Prisma } from '../../../../prisma';

export const userVenueOmit: Prisma.UserOmit = {
  experience: true,
  genre: true,
  availability: true,
  price: true,
};
