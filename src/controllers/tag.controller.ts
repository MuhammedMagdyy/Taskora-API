import asyncHandler from 'express-async-handler';
import { tagService } from '../services';
import {
  CREATED,
  NO_CONTENT,
  OK,
  paramsSchema,
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
  const tags = await tagService.findMany({
    userUuid: req.user?.uuid as string,
  });

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
