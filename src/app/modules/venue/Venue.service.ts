import { prisma } from '../../../utils/db';
import { TUpdateVenue } from './Venue.interface';

export const VenueServices = {
  async updateVenue({ venue_id, ...payload }: TUpdateVenue) {
    return prisma.user.update({
      where: { id: venue_id },
      data: payload,
    });
  },
};
