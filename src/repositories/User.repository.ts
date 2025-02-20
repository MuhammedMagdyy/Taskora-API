import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';
import {
  CustomProjectUncheckedCreateInput,
  CustomTaskUncheckedCreateInput,
} from '../types/prisma';

export class UserRepository {
  private readonly dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  async createOne(data: Prisma.UserUncheckedCreateInput) {
    return await this.dbClient.user.create({ data });
  }

  async findOne(query: Prisma.UserWhereInput) {
    return await this.dbClient.user.findFirst({ where: query });
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput
  ) {
    return await this.dbClient.user.update({ where: query, data });
  }

  async initializeUserWithProjectAndTasks(
    userData: Prisma.UserUncheckedCreateInput,
    projectData: CustomProjectUncheckedCreateInput,
    taskData: CustomTaskUncheckedCreateInput
  ) {
    return await this.dbClient.$transaction(async (dbTransaction) => {
      const user = await dbTransaction.user.create({ data: userData });

      const project = await dbTransaction.project.create({
        data: { ...projectData, userUuid: user.uuid },
      });

      await dbTransaction.task.create({
        data: { ...taskData, projectUuid: project.uuid, userUuid: user.uuid },
      });

      return user;
    });
  }
}

export const userRepository = new UserRepository(prismaClient);
