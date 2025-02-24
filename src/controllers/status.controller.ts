import asyncHandler from 'express-async-handler';
import { statusService } from '../services';
import { BAD_REQUEST, DB_COLUMNS, OK, sortSchema } from '../utils';
import { ISortQuery } from '../types';

export const getStatus = asyncHandler(async (req, res) => {
  const { uuid } = req.params;
  const status = await statusService.isStatusExists(uuid);

  res
    .status(OK)
    .json({ message: 'Retrieved status successfully', data: status });
});

export const getAllStatuses = asyncHandler(async (req, res) => {
  const { sortBy, order } = sortSchema.parse(req.query);
  const validColumns = Object.values(DB_COLUMNS.STATUS);
  const sortFields = sortBy?.split(',') || [];
  const sortOrders = order?.split(',') || [];

  const invalidFields = sortFields.filter(
    (field) => !validColumns.includes(field)
  );
  if (invalidFields.length > 0) {
    res.status(BAD_REQUEST).json({
      message: `Invalid sort field(s): ${invalidFields.join(', ')}. Allowed fields: ${validColumns.join(', ')}`,
    });
    return;
  }

  const orderBy: ISortQuery = sortFields.map((field, index) => ({
    [field]: sortOrders[index] === 'desc' ? 'desc' : 'asc',
  }));

  const statuses = await statusService.findMany(
    orderBy.length > 0 ? orderBy : undefined
  );

  res
    .status(OK)
    .json({ message: 'Retrieved statuses successfully', data: statuses });
});
