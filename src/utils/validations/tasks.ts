import { z } from 'zod';

export const taskSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character').trim(),
  description: z
    .string()
    .min(1, 'Description must be at least 1 characters')
    .trim()
    .optional(),
  dueDate: z.coerce.date().optional(),
  projectUuid: z.string().uuid({ message: 'project is required' }),
  tagUuid: z.string().uuid().optional(),
  statusUuid: z.string().uuid({ message: 'status is required' }),
});

export const taskUpdateSchema = z
  .object({
    name: z.string().min(1, 'Name must be at least 1 character').trim(),
    description: z
      .string()
      .min(1, 'Description must be at least 1 characters')
      .trim()
      .optional(),
    dueDate: z.coerce.date({ message: 'Due date is required' }),
    projectUuid: z.string().uuid({ message: 'Project is required' }),
    tagUuid: z.string().uuid({ message: 'Tag is required' }),
    statusUuid: z.string().uuid({ message: 'Status is required' }),
  })
  .partial();
