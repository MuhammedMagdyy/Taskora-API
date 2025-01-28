import asyncHandler from 'express-async-handler';
import { projectSerivce, statusSerivce } from '../../services';
import {
  projectSchema,
  projectUpdateSchema,
  CREATED,
  NO_CONTENT,
  OK,
  paginationSchema,
  sortSchema,
  DB_COLUNMS,
  BAD_REQUEST,
} from '../../utils';
import { ISortQuery } from '../../types';

export const createProject = asyncHandler(async (req, res) => {
  const schema = projectSchema.parse(req.body);
  const { statusUuid } = schema;

  await statusSerivce.isStatusExists(statusUuid);

  const project = await projectSerivce.createOne(schema);

  res
    .status(CREATED)
    .json({ message: 'Project created successfully!', data: project });
});

export const getProject = asyncHandler(async (req, res) => {
  const { uuid } = req.params;
  const project = await projectSerivce.isProjectExists(uuid);

  res
    .status(OK)
    .json({ message: 'Retrieved project successfully!', data: project });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const { pageNumber, pageSize } = paginationSchema.parse(req.query);
  const { sortBy, order } = sortSchema.parse(req.query);
  const validColumns = Object.values(DB_COLUNMS.PROJECT);
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

  const projects = await projectSerivce.findMany(
    { pageNumber, pageSize },
    orderBy.length > 0 ? orderBy : undefined
  );

  res
    .status(OK)
    .json({ message: 'Retrieved projects successfully!', data: projects });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { uuid } = req.params;
  const schema = projectUpdateSchema.parse(req.body);

  await projectSerivce.isProjectExists(uuid);

  const updatedProject = await projectSerivce.updateOne({ uuid }, schema);

  res
    .status(OK)
    .json({ message: 'Project updated successfully!', data: updatedProject });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { uuid } = req.params;
  await projectSerivce.deleteProjectByUUID(uuid);

  res.sendStatus(NO_CONTENT);
});
