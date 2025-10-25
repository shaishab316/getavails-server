import { Router } from 'express';
import { AuthControllers } from './Auth.controller';
import { AuthValidations } from './Auth.validation';
import { UserControllers } from '../user/User.controller';
import { UserValidations } from '../user/User.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/register',
  purifyRequest(UserValidations.register),
  UserControllers.register,
);

router.post(
  '/agent-register',
  purifyRequest(UserValidations.agentRegister),
  UserControllers.agentRegister,
);

router.post(
  '/venue-register',
  purifyRequest(UserValidations.venueRegister),
  UserControllers.venueRegister,
);

router.post(
  '/account-verify',
  purifyRequest(AuthValidations.accountVerify),
  AuthControllers.accountVerify,
);

router.post(
  '/login',
  purifyRequest(AuthValidations.login),
  AuthControllers.login,
);

router.post(
  '/account-verify/otp-send',
  purifyRequest(AuthValidations.otpSend),
  AuthControllers.accountVerifyOtpSend,
);

router.post(
  '/forgot-password',
  purifyRequest(AuthValidations.otpSend),
  AuthControllers.forgotPassword,
);

router.post(
  '/forgot-password/otp-verify',
  purifyRequest(AuthValidations.accountVerify),
  AuthControllers.forgotPasswordOtpVerify,
);

router.post(
  '/reset-password',
  auth.reset_token,
  purifyRequest(AuthValidations.resetPassword),
  AuthControllers.resetPassword,
);

router.get('/logout', AuthControllers.logout);

/**
 * generate new access token
 */
router.get('/refresh-token', auth.refresh_token, AuthControllers.refreshToken);

export const AuthRoutes = router;
