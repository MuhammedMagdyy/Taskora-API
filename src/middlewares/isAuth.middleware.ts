import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { JwtService, redisService } from '../services';
import { ApiError, UNAUTHORIZED } from '../utils';
import { IJwtPayload } from '../interfaces';

export const isAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError('Unauthorized', UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new ApiError('Unauthorized', UNAUTHORIZED));
    }

    const isInvalidated = await redisService.get(`invalidated-tokens:${token}`);

    if (isInvalidated) {
      throw new ApiError('Session expired, please log in again', UNAUTHORIZED);
    }

    const decoded = JwtService.verify(token, 'access') as IJwtPayload;

    req.user = { uuid: decoded.uuid as string };
    next();
  }
);
