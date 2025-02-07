import { Router } from 'express';
import { projects } from '../controllers';
import { isAuth } from '../middlewares';

const router = Router();

router.use(isAuth);
router.route('/').post(projects.createProject).get(projects.getAllProjects);
router
  .route('/:uuid')
  .get(projects.getProject)
  .patch(projects.updateProject)
  .delete(projects.deleteProject);

export { router as projectRouter };
