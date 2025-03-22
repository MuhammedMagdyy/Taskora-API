import { Router } from 'express';
import { tags } from '../controllers';
import { isAuth } from '../middlewares';

const router = Router();

router.use(isAuth);
router.route('/').post(tags.createTag).get(tags.getAllTags);
router
  .route('/:uuid')
  .get(tags.getTag)
  .patch(tags.updateTag)
  .delete(tags.deleteTag);

export { router as tagRouter };
