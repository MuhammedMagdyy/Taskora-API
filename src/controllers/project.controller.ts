import asyncHandler from 'express-async-handler';
import { projectService, statusService, tagService } from '../services';
import {
  CREATED,
  NO_CONTENT,
  OK,
  paramsSchema,
  projectSchema,
  projectUpdateSchema,
} from '../utils';

export const createProject = asyncHandler(async (req, res) => {
  const schema = projectSchema.parse(req.body);
  const userUuid = req.user?.uuid as string;
  const { statusUuid, tagUuid } = schema;

  await statusService.isStatusExists(statusUuid);

  if (tagUuid) {
    await tagService.isTagExists(tagUuid, userUuid);
  }

  const project = await projectService.createOne({
    ...schema,
    userUuid: req.user?.uuid as string,
  });

  res
    .status(CREATED)
    .json({ message: 'Project created successfully!', data: project });
});

export const getProject = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUuid = req.user?.uuid as string;
  const project = await projectService.isProjectExists(uuid, userUuid);

  res
    .status(OK)
    .json({ message: 'Retrieved project successfully!', data: project });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.findMany({
    userUuid: req.user?.uuid as string,
  });

  res
    .status(OK)
    .json({ message: 'Retrieved projects successfully!', data: projects });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUuid = req.user?.uuid as string;
  const schema = projectUpdateSchema.parse(req.body);

  await projectService.isProjectExists(uuid, userUuid);

  const updatedProject = await projectService.updateOne(
    { uuid },
    schema,
    userUuid,
  );

  res
    .status(OK)
    .json({ message: 'Project updated successfully!', data: updatedProject });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUuid = req.user?.uuid as string;

  await projectService.deleteProjectByUUID(uuid, userUuid);

  res.sendStatus(NO_CONTENT);
});
