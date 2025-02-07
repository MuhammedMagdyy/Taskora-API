import { Router } from 'express';
import { tasks } from '../controllers';
import { isAuth } from '../middlewares';

const router = Router();

router.use(isAuth);
router.route('/').post(tasks.createTask).get(tasks.getAllTasks);
router
  .route('/:uuid')
  .get(tasks.getTask)
  .patch(tasks.updateTask)
  .delete(tasks.deleteTask);

export { router as taskRouter };
