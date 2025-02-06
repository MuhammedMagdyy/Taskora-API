import { Router } from 'express';
import { googleRouter } from './google.routes';
import { auth } from '../controllers';
import { isAuth } from '../middlewares';

const router = Router();

router.use('/google', googleRouter);
router.post('/register', auth.localRegister);
router.post('/login', auth.localLogin);
router.get('/logout', isAuth, auth.logout);
router.get('/refresh-token', auth.refreshToken);

export { router as authRouter };
