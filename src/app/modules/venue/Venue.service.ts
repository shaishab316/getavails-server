import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { EVenueOfferStatus, prisma } from '../../../utils/db';
import { userOmit } from '../user/User.constant';
import type {
  TCancelVenueOfferArgs,
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

  /**
   * Cancel agent offer
   */
  async cancelOffer({
    offer_id,
    venue_id,
    organizer_id,
  }: TCancelVenueOfferArgs) {
    const offer = await prisma.venueOffer.findFirst({
      where: { id: offer_id, venue_id, organizer_id },
    });

    if (!offer) {
      throw new ServerError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to cancel this offer',
      );
    }

    if (offer.status === EVenueOfferStatus.CANCELLED) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'This offer is already cancelled',
      );
    }

    return prisma.venueOffer.update({
      where: { id: offer_id },
      data: { status: EVenueOfferStatus.CANCELLED, cancelled_at: new Date() },
    });
  },
};
