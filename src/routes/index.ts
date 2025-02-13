import { Router } from 'express';
import { ApiError } from '../utils';
import { NOT_FOUND, OK } from '../utils';
import { projectRouter } from './project.routes';
import { tagRouter } from './tag.routes';
import { taskRouter } from './task.routes';
import { statusRouter } from './status.routes';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { isVerified } from '../middlewares';

const router = Router();

router.get('/health', (_, res) => {
  res.status(OK).json({ message: `I'm healthy 🤸‍♂️` });
});

router.use('/auth', authRouter);
router.use('/projects', isVerified, projectRouter);
router.use('/tags', isVerified, tagRouter);
router.use('/tasks', isVerified, taskRouter);
router.use('/statuses', isVerified, statusRouter);
router.use('/users', isVerified, userRouter);

router.all('*', (request, _res, next) => {
  return next(
    new ApiError(`The route ${request.originalUrl} can't be found`, NOT_FOUND)
  );
});

export default router;
