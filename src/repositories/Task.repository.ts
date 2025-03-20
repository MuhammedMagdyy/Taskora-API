import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';
import { ISortQuery } from '../types';

export class TaskRepository {
  private readonly dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  async createOne(data: Prisma.TaskUncheckedCreateInput) {
    return await this.dbClient.task.create({ data });
  }

  async findOne(query: Prisma.TaskWhereUniqueInput) {
    return await this.dbClient.task.findUnique({ where: query });
  }

  async findMany(query: Prisma.TaskWhereInput, orderBy?: ISortQuery) {
    return await this.dbClient.task.findMany({ where: query, orderBy });
  }

  async updateOne(
    query: Prisma.TaskWhereUniqueInput,
    data: Prisma.TaskUncheckedUpdateInput,
  ) {
    return await this.dbClient.task.update({ where: query, data });
  }

  async deleteOne(query: Prisma.TaskWhereUniqueInput) {
    return await this.dbClient.task.delete({ where: query });
  }
}

export const taskRepository = new TaskRepository(prismaClient);
