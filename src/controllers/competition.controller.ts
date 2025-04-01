import asyncHandler from 'express-async-handler';
import { CompetitionService } from '../services';
import { ACCEPTED, answerSchema, OK } from '../utils';

export const startChallenge = asyncHandler(async (_req, res) => {
  await CompetitionService.start();

  res.status(OK).json({ message: 'Challenge started' });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { answerId } = answerSchema.parse(req.body);
  const userUuid = req.user?.uuid as string;
  const result = await CompetitionService.processAnswer(userUuid, answerId);

  res.status(ACCEPTED).json(result);
});

export const fetchWinners = asyncHandler(async (_req, res) => {
  const result = await CompetitionService.getWinners();

  res.status(OK).json(result);
});
