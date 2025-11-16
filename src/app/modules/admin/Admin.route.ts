import { Router } from 'express';
import { UserRoutes } from '../user/User.route';
import { injectRoutes } from '../../../utils/router/injectRouter';
import { AdminControllers } from './Admin.controller';
import { BlogRoutes } from '../blog/Blog.route';
import { SubscriptionRoutes } from '../subscription/Subscription.route';

const admin = injectRoutes(Router(), {
  '/users': [UserRoutes.admin],
  '/blogs': [BlogRoutes.admin],
  '/subscriptions': [SubscriptionRoutes.admin],
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
