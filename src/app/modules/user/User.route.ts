import { Router } from 'express';
import { UserControllers } from './User.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { UserValidations } from './User.validation';
import capture from '../../middlewares/capture';
import { AuthControllers } from '../auth/Auth.controller';
import { changePasswordRateLimiter } from '../auth/Auth.utils';

const avatarCapture = capture({
  avatar: {
    size: 5 * 1024 * 1024,
    maxCount: 1,
    fileType: 'images',
  },
});

const admin = Router();
{
  admin.get(
    '/',
    purifyRequest(QueryValidations.list, UserValidations.getAllUser),
    UserControllers.superGetAllUser,
  );

  admin.patch(
    '/:userId/edit',
    avatarCapture,
    purifyRequest(
      QueryValidations.exists('userId', 'user'),
      UserValidations.editProfile,
    ),
    UserControllers.superEditProfile,
  );

  admin.delete(
    '/:userId/delete',
    purifyRequest(QueryValidations.exists('userId', 'user')),
    UserControllers.superDeleteAccount,
  );
}

const all = Router();
{
  all.get('/', UserControllers.profile);

  all.patch(
    '/edit',
    avatarCapture,
    purifyRequest(UserValidations.editProfile),
    UserControllers.editProfile,
  );

  all.post(
    '/update-availability',
    purifyRequest(UserValidations.updateAvailability),
    UserControllers.updateAvailability,
  );

  all.delete('/delete', UserControllers.deleteAccount);

  all.post(
    '/change-password',
    changePasswordRateLimiter,
    purifyRequest(UserValidations.changePassword),
    AuthControllers.changePassword,
  );
}

export const UserRoutes = {
  /**
   * Only admin can access
   *
   * @url : (base_url)/admin/users/
   */
  admin,

  /**
   * All users can access
   *
   * @url : (base_url)/profile/
   */
  all,
};
