import { Router } from 'express';
import { isAuth, multerMiddlewareUpload } from '../middlewares';
import { users } from '../controllers';

const router = Router();

router.use(isAuth);
router.get('/profile', users.getUser);
router.patch(
  '/:uuid',
  multerMiddlewareUpload.single('image'),
  users.updateUser
);

export { router as userRouter };
