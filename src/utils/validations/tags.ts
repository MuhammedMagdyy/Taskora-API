import { z } from 'zod';

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must be at least 1 characters')
    .max(30, 'Name must be at most 30 characters')
    .trim(),
  color: z
    .string()
    .min(3, 'Color must be at least 3 characters')
    .max(20, 'Color must be at most 20 characters')
    .trim(),
});
