import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';
import { ISortQuery } from '../types';

export class StatusRepository {
  private readonly dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  async findOne(query: Prisma.StatusWhereUniqueInput) {
    return await this.dbClient.status.findUnique({ where: query });
  }

  async findMany(orderBy?: ISortQuery) {
    return await this.dbClient.status.findMany({ orderBy });
  }
}

export const statusRepository = new StatusRepository(prismaClient);
