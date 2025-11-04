import { prisma } from '../../../utils/db';
import { userOmit } from '../user/User.constant';
import type {
  TUpdateVenueArgs,
  TVenueCreateOfferArgs,
} from './Venue.interface';

/**
 * All venue related services
 */
export const VenueServices = {
  /**
   * Update venue information
   */
  async updateVenue({ venue_id, ...payload }: TUpdateVenueArgs) {
    return prisma.user.update({
      where: { id: venue_id },
      data: payload,
      //? skip unnecessary fields
      omit: userOmit.VENUE,
    });
  },

  /**
   * Create new agent offer
   */
  async createOffer(payload: TVenueCreateOfferArgs) {
    //? ensure that start date is before end date
    if (!payload.end_date) {
      payload.end_date = payload.start_date;
    }

    return prisma.venueOffer.create({
      data: payload,
    });
  },
};
