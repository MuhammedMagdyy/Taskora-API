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
  const userUpdateData = updateUserSchema.parse(req.body);

  await userService.updateUserInfo(userUUID, uuid, userUpdateData, req.file);

  res.status(OK).json({ message: 'User updated successfully!' });
});

export const ramadanChallenge = asyncHandler(async (req, res) => {
  const userUuid = req.user?.uuid as string;
  await userService.ramadanChallenge(userUuid);

  res
    .status(OK)
    .json({ message: 'Ramadan challenge initialized successfully!' });
});
