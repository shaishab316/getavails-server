import { Router } from 'express';
import { UserRoutes } from '../user/User.route';
import { injectRoutes } from '../../../utils/router/injectRouter';

export default injectRoutes(Router(), {
  '/users': [UserRoutes.admin],
});
