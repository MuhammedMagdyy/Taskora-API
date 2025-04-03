import asyncHandler from 'express-async-handler';
import { userService } from '../services';
import { OK, paramsSchema, updateUserSchema } from '../utils';

export const getUserInfo = asyncHandler(async (req, res) => {
  const userUuid = req.user?.uuid as string;
  const user = await userService.getUserInfo(userUuid);

  res.json({ message: 'User retrieved successfully!', data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const userUUID = req.user?.uuid as string;
  const validatedData = updateUserSchema.parse({
    ...req.body,
    picture: req.file ? req.file.path : undefined,
  });

  await userService.updateUserInfo(userUUID, uuid, validatedData, req.file);

  res.status(OK).json({ message: 'User updated successfully!' });
});

export const ramadanChallenge = asyncHandler(async (req, res) => {
  const userUuid = req.user?.uuid as string;
  await userService.ramadanChallenge(userUuid);

  res
    .status(OK)
    .json({ message: 'Ramadan challenge initialized successfully!' });
});
