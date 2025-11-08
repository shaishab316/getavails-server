import catchAsync from '../../middlewares/catchAsync';
import { AdminServices } from './Admin.service';

export const AdminControllers = {
  getAdminOverview: catchAsync(async () => {
    const overview = await AdminServices.getAdminOverview();

    return {
      message: 'Admin overview retrieved successfully!',
      data: overview,
    };
  }),
};
