import asyncHandler from 'express-async-handler';
import { authService } from '../services';
import {
  ApiError,
  BAD_REQUEST,
  CREATED,
  loginSchema,
  OK,
  registerSchema,
  UNAUTHORIZED,
} from '../utils';

export const localRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  const tokens = await authService.register(name, email, password);

  res.status(CREATED).json({ message: 'Registered successfully', tokens });
});

export const localLogin = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const tokens = await authService.login(email, password);

  res.status(OK).json({ message: 'Logged in successfully', tokens });
});

export const logout = asyncHandler(async (req, res) => {
  const uuid = req.user?.uuid as string;

  if (!uuid) {
    throw new ApiError('Unauthorized', UNAUTHORIZED);
  }

  const refreshToken = req.body.refreshToken as string;

  if (!refreshToken) {
    throw new ApiError('Unauthorized', UNAUTHORIZED);
  }

  await authService.logout(refreshToken);

  res.status(OK).json({ message: 'Logged out successfully' });
});

export const generateAuthUrl = asyncHandler(async (req, res) => {
  const authorizeUrl = await authService.getGoogleAuthUrl();

  res.redirect(authorizeUrl);
});

export const handleGoogleCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code as string;

  if (!code) {
    return next(new ApiError('No code found in query parameters', BAD_REQUEST));
  }

  await authService.getGoogleTokens(code);
  const userInfo = await authService.getGoogleUserInfo();

  res.json({
    message: 'Logged in successfully!',
    tokens: {
      accessToken: userInfo.accessToken,
      refreshToken: userInfo.refreshToken,
    },
  });
});

export const handleGitHubCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code as string;

  if (!code) {
    return next(new ApiError('No code found in query parameters', BAD_REQUEST));
  }

  const accessToken = await authService.getGitHubAccessToken(code);
  const userInfo = await authService.getGitHubUserInfo(accessToken);

  res.json({
    message: 'Logged in successfully!',
    tokens: {
      accessToken: userInfo?.accessToken,
      refreshToken: userInfo?.refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError('Unauthorized', UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError('Unauthorized', UNAUTHORIZED));
  }

  const tokens = await authService.refreshAccessToken(token);

  res.status(OK).json({ message: 'Token refreshed successfully', tokens });
});
