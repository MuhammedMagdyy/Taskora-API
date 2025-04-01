import z from 'zod';

export const answerSchema = z.object({
  answerId: z.coerce.number().int().positive(),
});
