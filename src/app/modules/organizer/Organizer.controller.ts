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
      message: 'Agent offer accepted successfully!',
      data: {
        amount,
        url,
      },
    };
  }),
};
