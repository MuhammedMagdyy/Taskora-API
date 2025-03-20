import { z } from 'zod';

export const paginationSchema = z.object({
  pageNumber: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const sortSchema = z
  .object({
    sortBy: z.string().optional(),
    order: z.string().optional(),
  })
  .refine(
    (data) =>
      (!data.sortBy && !data.order) ||
      data.sortBy?.split(',').length === data.order?.split(',').length,
    { message: "'sortBy' and 'order' must have the same number of fields" },
  );
