import { prisma } from '../../../utils/db';
import { TUpdateVenue } from './Venue.interface';

export const VenueServices = {
  async getMyVenue(venue_id: string) {
    return prisma.user.findUnique({
      where: { id: venue_id },
    });
  },

  async updateVenue({ venue_id, ...payload }: TUpdateVenue) {
    return prisma.user.update({
      where: { id: venue_id },
      data: payload,
    });
  },
};
