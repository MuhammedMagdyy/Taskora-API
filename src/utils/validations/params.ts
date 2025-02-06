import { z } from 'zod';

export const paramsSchema = z.object({
  uuid: z.string().uuid(),
});
