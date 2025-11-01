import catchAsync from '../../middlewares/catchAsync';
import { OrganizerServices } from './Organizer.service';

export const OrganizerControllers = {
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
};
