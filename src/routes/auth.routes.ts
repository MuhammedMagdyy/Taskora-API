import { Router } from 'express';
import { googleRouter } from './google.routes';
import { githubRouter } from './github.routes';
import { auth } from '../controllers';
import {
  isAuth,
  oneMinuteLimiter,
  twentyFourHourLimiter,
} from '../middlewares';

const router = Router();

router.use('/google', googleRouter);
router.use('/github', githubRouter);
router.post('/register', auth.localRegister);
router.post('/login', auth.localLogin);
router.post('/logout', isAuth, auth.logout);
router.post('/refresh-token', auth.refreshToken);
router.get('/verify-email', auth.verifyEmail);
router.post(
  '/resend-verify-email',
  oneMinuteLimiter,
  twentyFourHourLimiter,
  auth.resendVerificationEmail
);
router.post(
  '/forgot-password',
  oneMinuteLimiter,
  twentyFourHourLimiter,
  auth.forgotPassword
);
router.post('/verify-otp', auth.verifyOtp);

export { router as authRouter };
