import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

export class StatusRepository {
  constructor(private readonly dbClient: PrismaClient) {}

  async createMany(data: Prisma.StatusCreateManyInput[]) {
    return await this.dbClient.status.createMany({ data });
  }

  async findOne(query: Prisma.StatusWhereUniqueInput) {
    return await this.dbClient.status.findUnique({ where: query });
  }

  async findMany() {
    return await this.dbClient.status.findMany();
  }

  async getStatusCount() {
    return await this.dbClient.status.count();
  }
}

export const statusRepository = new StatusRepository(prismaClient);
