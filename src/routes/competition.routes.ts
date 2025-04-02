import { Router } from 'express';
import { competition } from '../controllers';
import { isAuth } from '../middlewares';

const router = Router();

router.use(isAuth);
router.post('/start', competition.startChallenge);
router.post('/submit-answer', competition.submitAnswer);
router.get('/winners', competition.fetchWinners);

export { router as competitionRouter };
