import asyncHandler from 'express-async-handler';
import { tagService } from '../services';
import { ISortQuery } from '../types';
import {
  BAD_REQUEST,
  CREATED,
  DB_COLUMNS,
  NO_CONTENT,
  OK,
  paramsSchema,
  sortSchema,
  tagSchema,
  updateTagSchema,
} from '../utils';

export const createTag = asyncHandler(async (req, res) => {
  const schema = tagSchema.parse(req.body);
  const tag = await tagService.createOne({
    ...schema,
    userUuid: req.user?.uuid as string,
  });

  res.status(CREATED).json({ message: 'Tag created successfully!', data: tag });
});

export const getTag = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUuid = req.user?.uuid as string;

  const tag = await tagService.isTagExists(uuid, userUuid);

  res.status(OK).json({ message: 'Retrieved tag successfully!', data: tag });
});

export const getAllTags = asyncHandler(async (req, res) => {
  const { sortBy, order } = sortSchema.parse(req.query);
  const validColumns = Object.values(DB_COLUMNS.TAG);
  const sortFields = sortBy?.split(',') || [];
  const sortOrders = order?.split(',') || [];

  const invalidFields = sortFields.filter(
    (field) => !validColumns.includes(field),
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

  const tags = await tagService.findMany(
    { userUuid: req.user?.uuid as string },
    orderBy.length > 0 ? orderBy : undefined,
  );

  res.status(OK).json({ message: 'Retrieved tags successfully!', data: tags });
});

export const updateTag = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const schema = updateTagSchema.parse(req.body);
  const userUuid = req.user?.uuid as string;

  const tag = await tagService.updateTagByUuid(uuid, schema, userUuid);

  res.status(OK).json({ message: 'Tag updated successfully!', data: tag });
});

export const deleteTag = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUuid = req.user?.uuid as string;

  await tagService.deleteTagByUuid(uuid, userUuid);

  res.sendStatus(NO_CONTENT);
});
