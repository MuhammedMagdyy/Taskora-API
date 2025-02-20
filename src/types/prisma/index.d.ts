import { Prisma } from '@prisma/client';

export type CustomProjectUncheckedCreateInput = Omit<
  Prisma.ProjectUncheckedCreateInput,
  'userUuid'
>;

export type CustomTaskUncheckedCreateInput = Omit<
  Prisma.TaskUncheckedCreateInput,
  'projectUuid' | 'userUuid'
>;
