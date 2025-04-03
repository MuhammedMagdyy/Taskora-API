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
  verifyEmailSchema,
  verifyOtpSchema,
} from '../utils';

export const localRegister = asyncHandler(async (req, res) => {
  const userRegistrationInfo = registerSchema.parse(req.body);
  const userInfo = await authService.register(userRegistrationInfo);

  res.status(CREATED).json({
    message: 'Registered successfully',
    data: userInfo.data,
    tokens: userInfo.tokens,
  });
});

export const localLogin = asyncHandler(async (req, res) => {
  const userLoginInfo = loginSchema.parse(req.body);
  const userInfo = await authService.login(userLoginInfo);

  res.status(OK).json({
    message: 'Logged in successfully',
    data: userInfo.data,
    tokens: userInfo.tokens,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken as string;
  await authService.logout(refreshToken);

  res.status(OK).json({ message: 'Logged out successfully' });
});

export const generateAuthUrl = asyncHandler((_req, res) => {
  const authorizeUrl = googleService.getGoogleAuthUrl();

  if (!authorizeUrl) {
    throw new ApiError('Failed to generate Google auth URL', BAD_REQUEST);
  }

  res.redirect(authorizeUrl);
});

export const handleGoogleCallback = asyncHandler(async (req, res) => {
  const code = req.query.code as string;
  const token = await googleService.getGoogleAccessToken(code);
  const userInfo = await googleService.getGoogleUserInfo(token as string);

  res.json({
    message: 'Logged in successfully!',
    data: userInfo?.userResponse,
    tokens: {
      accessToken: userInfo?.tokens.accessToken,
      refreshToken: userInfo?.tokens.refreshToken,
    },
  });
});

export const handleGitHubCallback = asyncHandler(async (req, res) => {
  const code = req.query.code as string;
  const accessToken = await githubService.getGitHubAccessToken(code);
  const userInfo = await githubService.getGitHubUserInfo(accessToken as string);

  res.json({
    message: 'Logged in successfully!',
    data: userInfo?.userResponse,
    tokens: {
      accessToken: userInfo?.tokens.accessToken,
      refreshToken: userInfo?.tokens.refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization as string;
  const tokens = await authService.refreshAccessToken(authHeader);

  res.status(OK).json({ message: 'Token refreshed successfully', tokens });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = verifyEmailSchema.parse(req.query);

  await authService.verifyEmail(token);

  res.status(OK).json({ message: 'Email verified successfully' });
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = resendVerificationEmailSchema.parse(req.body);

  await authService.resendVerificationEmail(email);

  res.status(OK).json({ message: 'Verification email sent successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  await authService.generateOTP(email);

  res.status(OK).json({ message: 'Password reset email sent successfully' });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const verifyOtpInfo = verifyOtpSchema.parse(req.body);

  const token = await authService.verifyOTP(verifyOtpInfo);

  res.status(OK).json({ message: 'OTP verified successfully', token });
});
