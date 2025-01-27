import { Router } from 'express';
import { ApiError } from '../utils';
import { NOT_FOUND, OK } from '../utils';
import { projectRouter } from './projects';
import { tagRouter } from './tags';
import { taskRouter } from './tasks';
import { statusRouter } from './statuses';
import { passportRouter } from './passport/strategies';

const router = Router();

router.get('/health', (_, res) => {
  res.status(OK).json({ message: `I'm healthy 🤸‍♂️` });
});

router.use('/auth', passportRouter);
router.use('/projects', projectRouter);
router.use('/tags', tagRouter);
router.use('/tasks', taskRouter);
router.use('/statuses', statusRouter);

router.all('*', (request, _res, next) => {
  return next(
    new ApiError(`The route ${request.originalUrl} can't be found`, NOT_FOUND)
  );
});

export default router;
