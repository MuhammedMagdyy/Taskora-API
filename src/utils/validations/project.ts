import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character').trim(),
  description: z.string().trim().optional(),
  statusUuid: z.string().uuid({ message: 'Status is required' }),
  color: z
    .string()
    .min(3, 'Color must be at least 3 characters')
    .max(20, 'Color must be at most 20 characters')
    .trim(),
  dueDate: z.coerce.date({ message: 'Due date is required' }).optional(),
  tagUuid: z.string().uuid().optional(),
});

export const projectUpdateSchema = z
  .object({
    name: z.string().min(1, 'Name must be at least 1 character').trim(),
    description: z.string().trim(),
    statusUuid: z.string().uuid({ message: 'Status is required' }),
    color: z
      .string()
      .min(3, 'Color must be at least 3 characters')
      .max(20, 'Color must be at most 20 characters')
      .trim(),
    dueDate: z.coerce.date({ message: 'Due date is required' }),
    tagUuid: z.string().uuid({ message: 'Tag is required' }),
  })
  .partial();
