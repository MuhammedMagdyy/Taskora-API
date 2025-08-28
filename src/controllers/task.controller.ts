import asyncHandler from 'express-async-handler';
import {
  projectService,
  statusService,
  tagService,
  taskService,
} from '../services';
import {
  CREATED,
  NO_CONTENT,
  OK,
  paramsSchema,
  taskSchema,
  taskUpdateSchema,
} from '../utils';

export const createTask = asyncHandler(async (req, res) => {
  const schema = taskSchema.parse(req.body);
  const userUuid = req.user?.uuid as string;
  const { projectUuid, tagUuid, statusUuid } = schema;

  await projectService.isProjectExists(projectUuid, userUuid);

  if (tagUuid) {
    await tagService.isTagExists(tagUuid, userUuid);
  }

  await statusService.isStatusExists(statusUuid);

  const task = await taskService.createOne({
    ...schema,
    userUuid: req.user?.uuid as string,
  });

  res
    .status(CREATED)
    .json({ message: 'Task created successfully!', data: task });
});

export const getTask = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUuid = req.user?.uuid as string;

  const task = await taskService.isTaskExists(uuid, userUuid);

  res.status(OK).json({ message: 'Retrieved task successfully!', data: task });
});

export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.findMany({
    userUuid: req.user?.uuid as string,
  });

  res
    .status(OK)
    .json({ message: 'Retrieved tasks successfully!', data: tasks });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const schema = taskUpdateSchema.parse(req.body);
  const userUuid = req.user?.uuid as string;

  await taskService.isTaskExists(uuid, userUuid);

  const updatedTask = await taskService.updateOne({ uuid }, schema);

  res
    .status(OK)
    .json({ message: 'Task updated successfully!', data: updatedTask });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUuid = req.user?.uuid as string;

  await taskService.deleteTaskByUUID(uuid, userUuid);

  res.sendStatus(NO_CONTENT);
});
