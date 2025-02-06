import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters').trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .trim(),
    picture: z.string().trim(),
  })
  .partial();
