import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { JwtService, userService } from '../services';
import { ApiError, FORBIDDEN, UNAUTHORIZED } from '../utils';
import { IJwtPayload } from '../interfaces';

export const isVerified = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError('Unauthorized', UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new ApiError('Unauthorized', UNAUTHORIZED));
    }

    const decoded = JwtService.verify(token, 'access') as IJwtPayload;
    const userInfo = await userService.findUserByUUID(decoded.uuid as string);

    if (!userInfo) {
      return next(
        new ApiError(
          `You don't have permission to access this route`,
          FORBIDDEN
        )
      );
    }

    if (!userInfo.isVerified) {
      return next(new ApiError('You need to verify your email', FORBIDDEN));
    }

    next();
  }
);
