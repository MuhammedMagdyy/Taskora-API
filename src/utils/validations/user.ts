import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(1, 'Name must be at least 1 character').trim(),
    password: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[a-z]).{8,}$/,
        'Password: 8+ chars, 1 number, 1 special, 1 lowercase'
      )
      .trim(),
    picture: z.string().trim(),
  })
  .partial();
