import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').trim(),
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z].*[a-z].*[a-z]).{8}$/,
      'Password must contain at least 8 characters, 1 uppercase letter, 5 lowercase letters, 1 number, and 1 special character (!@#$&*)'
    )
    .trim(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().trim(),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim(),
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
