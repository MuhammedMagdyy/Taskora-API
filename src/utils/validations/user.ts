import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(1, 'Name must be at least 1 character').trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .trim(),
    picture: z.string().trim(),
  })
  .partial();
