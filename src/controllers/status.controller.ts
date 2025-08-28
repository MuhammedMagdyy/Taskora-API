import asyncHandler from 'express-async-handler';
import { statusService } from '../services';
import { OK, paramsSchema } from '../utils';

export const getStatus = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const status = await statusService.isStatusExists(uuid);

  res
    .status(OK)
    .json({ message: 'Retrieved status successfully', data: status });
});

export const getAllStatuses = asyncHandler(async (_req, res) => {
  const statuses = await statusService.findMany();

  res
    .status(OK)
    .json({ message: 'Retrieved statuses successfully', data: statuses });
});
