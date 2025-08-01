import { Router } from 'express';
import { auth } from '../controllers';
import { authLimiter, isAuth, twentyFourHourLimiter } from '../middlewares';
import { githubRouter } from './github.routes';
import { googleRouter } from './google.routes';

const router = Router();

router.use('/google', googleRouter);
router.use('/github', githubRouter);

router.use(authLimiter, twentyFourHourLimiter);
router.post('/register', auth.localRegister);
router.post('/login', auth.localLogin);
router.post('/logout', isAuth, auth.logout);
router.post('/refresh-token', auth.refreshToken);
router.get('/verify-email', auth.verifyEmail);
router.post('/resend-verify-email', auth.resendVerificationEmail);
router.post('/forgot-password', auth.forgotPassword);
router.post('/verify-otp', auth.verifyOtp);

export { router as authRouter };
