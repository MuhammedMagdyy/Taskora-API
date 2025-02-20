import asyncHandler from 'express-async-handler';
import { authService, githubService, googleService } from '../services';
import {
  ApiError,
  BAD_REQUEST,
  CREATED,
  forgotPasswordSchema,
  loginSchema,
  OK,
  registerSchema,
  resendVerificationEmailSchema,
  UNAUTHORIZED,
  verifyEmailSchema,
  verifyOtpSchema,
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
  const authorizeUrl = await googleService.getGoogleAuthUrl();

  if (!authorizeUrl) {
    throw new ApiError('Failed to generate Google auth URL', BAD_REQUEST);
  }

  res.redirect(authorizeUrl);
});

export const handleGoogleCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code as string;

  if (!code) {
    return next(new ApiError('No code found in query parameters', BAD_REQUEST));
  }

  const token = await googleService.getGoogleAccessToken(code);

  if (!token) {
    return next(
      new ApiError('Failed to fetch Google access token', UNAUTHORIZED)
    );
  }

  const userInfo = await googleService.getGoogleUserInfo(token);

  res.json({
    message: 'Logged in successfully!',
    data: userInfo?.userResponse,
    tokens: {
      accessToken: userInfo?.tokens.accessToken,
      refreshToken: userInfo?.tokens.refreshToken,
    },
  });
});

export const handleGitHubCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code as string;

  if (!code) {
    return next(new ApiError('No code found in query parameters', BAD_REQUEST));
  }

  const accessToken = await githubService.getGitHubAccessToken(code);
  const userInfo = await githubService.getGitHubUserInfo(accessToken);

  res.json({
    message: 'Logged in successfully!',
    data: userInfo?.userResponse,
    tokens: {
      accessToken: userInfo?.tokens.accessToken,
      refreshToken: userInfo?.tokens.refreshToken,
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
  const { token } = verifyEmailSchema.parse(req.query);

  if (!token) {
    return next(new ApiError('Invalid or expired token', BAD_REQUEST));
  }

  await authService.verifyEmail(token);

  res.status(OK).json({ message: 'Email verified successfully' });
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = resendVerificationEmailSchema.parse(req.body);

  if (!email) {
    throw new ApiError('Email is required', BAD_REQUEST);
  }

  await authService.resendVerificationEmail(email);

  res.status(OK).json({ message: 'Verification email sent successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  if (!email) {
    throw new ApiError('Email is required', BAD_REQUEST);
  }

  await authService.generateOTP(email);

  res.status(OK).json({ message: 'Password reset email sent successfully' });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, password, otp } = verifyOtpSchema.parse(req.body);

  const token = await authService.verifyOTP(email, password, otp);

  res.status(OK).json({ message: 'OTP verified successfully', token });
});
