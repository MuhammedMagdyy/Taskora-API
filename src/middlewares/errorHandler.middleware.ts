import { Prisma } from '@prisma/client';
import { AxiosError } from 'axios';
import { UploadApiErrorResponse } from 'cloudinary';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import {
  ApiError,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  PAYLOAD_TOO_LARGE,
  SERVER,
  UNAUTHORIZED,
} from '../utils';

type ErrorType =
  | ApiError
  | ZodError
  | Error
  | Prisma.PrismaClientKnownRequestError
  | JsonWebTokenError
  | UploadApiErrorResponse
  | MulterError
  | AxiosError;

export const errorHandler: ErrorRequestHandler = (
  error: ErrorType,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ApiError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(BAD_REQUEST).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, message } = handlePrismaError(error);
    res.status(status).json({ message });
    return;
  }

  if (error instanceof JsonWebTokenError) {
    res.status(UNAUTHORIZED).json({ message: 'Invalid or expired token' });
    return;
  }

  if (isCloudinaryError(error)) {
    res.status(error.http_code).json({ message: error.message });
    return;
  }

  if (error instanceof MulterError) {
    const { status, message } = handleMulterError(error);
    res.status(status).json({ message });
    return;
  }

  if (error instanceof AxiosError) {
    res.status(error.response?.status || INTERNAL_SERVER_ERROR).json({
      message: error.response?.data?.message || 'External API request failed',
      errorDetails: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
      },
    });
    return;
  }

  if (process.env.NODE_ENV === SERVER.DEVELOPMENT) {
    sendErrorToDev(error, res);
  } else {
    sendErrorToProd(res);
  }
};

const sendErrorToDev = (error: ErrorType, res: Response): void => {
  res.status(INTERNAL_SERVER_ERROR).json({
    cause: 'Internal server error',
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorToProd = (res: Response): void => {
  res.status(INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error: Please try again later...',
  });
};

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError,
): { status: number; message: string } => {
  switch (error.code) {
    case 'P2000':
      return {
        status: BAD_REQUEST,
        message: 'Value too long for a database column. Please shorten it.',
      };
    case 'P2002':
      return {
        status: BAD_REQUEST,
        message: `Duplicate value for: ${error.meta?.target}`,
      };
    case 'P2003':
      return {
        status: BAD_REQUEST,
        message: 'Foreign key constraint failed. Check related entities.',
      };
    case 'P2010':
      return {
        status: INTERNAL_SERVER_ERROR,
        message: 'Raw query execution failed. Please check the query syntax.',
      };
    case 'P2014':
      return {
        status: BAD_REQUEST,
        message: 'Invalid WHERE clause. Check relationships between models.',
      };
    case 'P2023':
      return {
        status: BAD_REQUEST,
        message: 'Invalid data format. Please check your input values.',
      };
    case 'P2025':
      return {
        status: BAD_REQUEST,
        message: 'Record not found. Please verify your input.',
      };
    default:
      return {
        status: INTERNAL_SERVER_ERROR,
        message: 'Database error: Ensure the server is running correctly',
      };
  }
};

const isCloudinaryError = (error: unknown): error is UploadApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'http_code' in (error as Record<string, unknown>) &&
    'message' in (error as Record<string, unknown>)
  );
};

const handleMulterError = (
  error: MulterError,
): { status: number; message: string } => {
  const errorMap: Record<string, { status: number; message: string }> = {
    LIMIT_FILE_SIZE: {
      status: PAYLOAD_TOO_LARGE,
      message: 'File size too large. Please upload a smaller file.',
    },
    LIMIT_FILE_COUNT: {
      status: BAD_REQUEST,
      message: 'Too many files uploaded. Please upload fewer files.',
    },
    LIMIT_UNEXPECTED_FILE: {
      status: BAD_REQUEST,
      message: 'Unexpected file field. Please check the field name.',
    },
  };

  return (
    errorMap[error.code] || {
      status: INTERNAL_SERVER_ERROR,
      message: 'File upload error. Please try again later.',
    }
  );
};
