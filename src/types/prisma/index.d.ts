import { Prisma } from '@prisma/client';

export type CustomProjectUncheckedCreateInput = Omit<
  Prisma.ProjectUncheckedCreateInput,
  'userUuid' | 'statusUuid'
>;

export type CustomTaskUncheckedCreateInput = Omit<
  Prisma.TaskUncheckedCreateInput,
  'projectUuid' | 'userUuid' | 'statusUuid'
>;
