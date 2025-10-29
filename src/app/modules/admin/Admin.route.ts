import { Router } from 'express';
import { UserRoutes } from '../user/User.route';
import { injectRoutes } from '../../../utils/router/injectRouter';

const admin = injectRoutes(Router(), {
  '/users': [UserRoutes.admin],
});

export const AdminRoutes = {
  /**
   * Only admin can access
   *
   * @url : (base_url)/admin/
   */
  admin,
};
