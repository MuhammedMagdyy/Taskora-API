import { Router } from 'express';
import { users } from '../controllers';
import { isAuth, multerMiddlewareUpload } from '../middlewares';

const router = Router();

router.use(isAuth);
router.get('/profile', users.getUserInfo);
router.post('/challenge', users.ramadanChallenge);
router.patch(
  '/:uuid',
  multerMiddlewareUpload.single('image'),
  users.updateUser,
);

export { router as userRouter };
