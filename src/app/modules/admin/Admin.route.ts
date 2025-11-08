import { Router } from 'express';
import { UserRoutes } from '../user/User.route';
import { injectRoutes } from '../../../utils/router/injectRouter';
import { AdminControllers } from './Admin.controller';

const admin = injectRoutes(Router(), {
  '/users': [UserRoutes.admin],
});

admin.get('/overview', AdminControllers.getAdminOverview);

export const AdminRoutes = {
  /**
   * Only admin can access
   *
   * @url : (base_url)/admin/
   */
  admin,
};
