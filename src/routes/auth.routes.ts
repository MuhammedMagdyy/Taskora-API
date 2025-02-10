import { Router } from 'express';
import { googleRouter } from './google.routes';
import { githubRouter } from './github.routes';
import { auth } from '../controllers';
import { isAuth } from '../middlewares';

const router = Router();

router.use('/google', googleRouter);
router.use('/github', githubRouter);
router.post('/register', auth.localRegister);
router.post('/login', auth.localLogin);
router.post('/logout', isAuth, auth.logout);
router.post('/refresh-token', auth.refreshToken);

export { router as authRouter };
