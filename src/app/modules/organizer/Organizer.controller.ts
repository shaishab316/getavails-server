import catchAsync from '../../middlewares/catchAsync';
import { OrganizerServices } from './Organizer.service';

/**
 * All organizer related controllers
 */
export const OrganizerControllers = {
  /**
   * Get agent offers
   */
  getAgentOffers: catchAsync(async ({ query, user: organizer }) => {
    const { meta, offers } = await OrganizerServices.getAgentOffers({
      ...query,
      organizer_id: organizer.id,
    });

    return {
      message: 'Agent offers retrieved successfully!',
      meta,
      data: offers,
    };
  }),

  /**
   * Accept agent offer
   */
  acceptAgentOffer: catchAsync(async ({ body, user: organizer }) => {
    const { amount, url } = await OrganizerServices.acceptAgentOffer({
      offer_id: body.offer_id,
      organizer_id: organizer.id,
    });

    return {
      message: 'Agent offer accepted link generated successfully!',
      data: {
        amount,
        url,
      },
    };
  }),

  /**
   * Get venue offers
   */
  getVenueOffers: catchAsync(async ({ query, user: organizer }) => {
    const { meta, offers } = await OrganizerServices.getVenueOffers({
      ...query,
      organizer_id: organizer.id,
    });

    return {
      message: 'Venue offers retrieved successfully!',
      meta,
      data: offers,
    };
  }),

  acceptVenueOffer: catchAsync(async ({ body, user: organizer }) => {
    const { amount, url } = await OrganizerServices.acceptVenueOffer({
      offer_id: body.offer_id,
      organizer_id: organizer.id,
    });

    return {
      message: 'Venue offer accepted link generated successfully!',
      data: {
        amount,
        url,
      },
    };
  }),
};
