import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(1, 'Name must be at least 1 character').trim(),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z].*[a-z].*[a-z]).{8,}$/,
        'Password: 8+ chars, 1 uppercase, 5 lowercase, 1 number, 1 special'
      )
      .trim(),
    picture: z.string().trim(),
  })
  .partial();
