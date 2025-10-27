import { Router } from 'express';
import { UserControllers } from './User.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { UserValidations } from './User.validation';
import capture from '../../middlewares/capture';
import { AuthControllers } from '../auth/Auth.controller';

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
    ':userId/edit',
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
    purifyRequest(UserValidations.changePassword),
    AuthControllers.changePassword,
  );
}

const venue = Router();
{
  venue.patch(
    '/edit',
    purifyRequest(UserValidations.updateVenue),
    UserControllers.updateVenue,
  );
}

export const UserRoutes = {
  admin,
  all,
  venue,
};
