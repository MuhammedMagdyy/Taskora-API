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
  const userInfo = await authService.register(name, email, password);

  res.status(CREATED).json({
    message: 'Registered successfully',
    data: userInfo.data,
    tokens: userInfo.tokens,
  });
});

export const localLogin = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const userInfo = await authService.login(email, password);

  res.status(OK).json({
    message: 'Logged in successfully',
    data: userInfo.data,
    tokens: userInfo.tokens,
  });
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
    data: userInfo.userResponse,
    tokens: {
      accessToken: userInfo.tokens.accessToken,
      refreshToken: userInfo.tokens.refreshToken,
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
    data: userInfo.userResponse,
    tokens: {
      accessToken: userInfo.tokens.accessToken,
      refreshToken: userInfo.tokens.refreshToken,
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

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token, userUuid } = req.query as { token: string; userUuid: string };

  if (!token || !userUuid) {
    return next(new ApiError('Invalid or expired token', BAD_REQUEST));
  }

  await authService.verifyEmail(token, userUuid);

  res.status(OK).json({ message: 'Email verified successfully' });
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body as { email: string };

  if (!email) {
    throw new ApiError('Email is required', BAD_REQUEST);
  }

  await authService.resendVerificationEmail(email);

  res.status(OK).json({ message: 'Verification email sent successfully' });
});
