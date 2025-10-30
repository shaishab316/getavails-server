import { prisma } from '../../../utils/db';
import { userOmit } from '../user/User.constant';
import type { TUpdateVenue } from './Venue.interface';

/**
 * All venue related services
 */
export const VenueServices = {
  /**
   * Update venue information
   */
  async updateVenue({ venue_id, ...payload }: TUpdateVenue) {
    return prisma.user.update({
      where: { id: venue_id },
      data: payload,
      //? skip unnecessary fields
      omit: userOmit.VENUE,
    });
  },
};
