import { Router } from 'express';
import { auth } from '../controllers';

const router = Router();

router.get('/callback', auth.handleGitHubCallback);

export { router as githubRouter };
