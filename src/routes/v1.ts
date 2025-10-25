import { Router } from 'express';
import auth from '../app/middlewares/auth';
import AdminRoutes from '../app/modules/admin/Admin.route';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { StatusCodes } from 'http-status-codes';
import { fileTypes } from '../app/middlewares/capture';
import { injectRoutes } from '../utils/router/injectRouter';

const appRouter = Router();

/** Forward uploaded files requests */
fileTypes.map((filetype: string) =>
  appRouter.get(`/${filetype}/:filename`, (req, res) =>
    res.redirect(
      StatusCodes.MOVED_PERMANENTLY,
      `/${filetype}/${encodeURIComponent(req.params.filename)}`,
    ),
  ),
);

export default injectRoutes(appRouter, {
  // No auth
  '/auth': [AuthRoutes],

  // Free auth
  '/profile': [auth.all, UserRoutes.user],

  // Admin auth
  '/admin': [auth.admin, AdminRoutes],
});
