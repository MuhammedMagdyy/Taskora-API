import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').trim(),
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().trim(),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim(),
  userUuid: z.string().trim(),
});

export const resendVerificationEmailSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
  otp: z.string().length(6, 'Invalid OTP').trim(),
});
