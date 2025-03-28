import asyncHandler from 'express-async-handler';
import { IUser } from '../interfaces';
import { cloudinaryService, HashingService, userService } from '../services';
import {
  ApiError,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  paramsSchema,
  updateUserSchema,
} from '../utils';

export const getUser = asyncHandler(async (req, res, next) => {
  const uuid = req.user?.uuid as string;

  const userExists = await userService.findUserByUUID(uuid);

  if (!userExists) {
    return next(new ApiError('User not found', NOT_FOUND));
  }

  const user: IUser = {
    uuid: userExists.uuid,
    name: userExists.name as string,
    email: userExists.email,
    isVerified: userExists.isVerified,
    picture: userExists.picture as string,
    hasPassword: userExists.password ? true : false,
    createdAt: userExists.createdAt,
  };

  res.json({ message: 'User retrieved successfully!', data: user });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const userUUID = req.user?.uuid as string;
  const { uuid } = paramsSchema.parse(req.params);

  if (userUUID !== uuid) {
    return next(
      new ApiError(`You are not allowed to access this resource`, FORBIDDEN),
    );
  }

  const user = await userService.findUserByUUID(userUUID);
  if (!user) {
    return next(new ApiError('User not found', NOT_FOUND));
  }

  let picture = user.picture;
  if (req.file) {
    const { image } = await cloudinaryService.uploadImage(req.file.path);
    picture = image;
  }

  const { name, password } = updateUserSchema.parse({
    ...req.body,
    picture: req.file ? picture : undefined,
  });

  if (name) user.name = name;
  if (password) {
    const isSamePassword = await HashingService.compare(
      password,
      user.password as string,
    );

    if (isSamePassword) {
      return next(
        new ApiError(
          'New password must be different from the current one',
          BAD_REQUEST,
        ),
      );
    }

    user.password = await HashingService.hash(password);
  }

  await userService.updateOne(
    { uuid: userUUID },
    { name: user.name, password: user.password, picture },
  );

  res.status(OK).json({ message: 'User updated successfully!' });
});

export const ramadanChallenge = asyncHandler(async (req, res) => {
  const userUuid = req.user?.uuid as string;

  await userService.ramadanChallenge(userUuid);

  res
    .status(OK)
    .json({ message: 'Ramadan challenge initialized successfully!' });
});
