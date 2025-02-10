import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

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
}

export const userRepository = new UserRepository(prismaClient);
