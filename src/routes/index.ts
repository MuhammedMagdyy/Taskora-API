import { Router } from 'express';
import { isVerified } from '../middlewares';
import { MemoryMonitor, OK } from '../utils';
import { authRouter } from './auth.routes';
import { competitionRouter } from './competition.routes';
import { projectRouter } from './project.routes';
import { statusRouter } from './status.routes';
import { tagRouter } from './tag.routes';
import { taskRouter } from './task.routes';
import { userRouter } from './user.routes';

const router = Router();

router.get('/health', (_req, res) => {
  const uptime = process.uptime();
  const memoryUsage = MemoryMonitor.getMemoryUsage();

  res.status(OK).json({
    message: `I'm healthy 🏋️‍♂️`,
    uptime: `${Math.floor(uptime / 60)} minutes`,
    timestamp: new Date().toISOString(),
    memory: {
      heapUsed: `${memoryUsage.heapUsed}MB`,
      heapTotal: `${memoryUsage.heapTotal}MB`,
      heapUsedPercent: `${memoryUsage.heapUsedPercent}%`,
      external: `${memoryUsage.external}MB`,
      rss: `${memoryUsage.rss}MB`,
    },
  });
});

router.use('/auth', authRouter);
router.use('/projects', isVerified, projectRouter);
router.use('/tags', isVerified, tagRouter);
router.use('/tasks', isVerified, taskRouter);
router.use('/statuses', isVerified, statusRouter);
router.use('/users', isVerified, userRouter);
router.use('/competitions', isVerified, competitionRouter);

export default router;
