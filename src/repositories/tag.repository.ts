import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';
import { ISortQuery } from '../types';

export class TagRepository {
  private readonly dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  async createOne(data: Prisma.TagUncheckedCreateInput) {
    return await this.dbClient.tag.create({ data });
  }

  async findOne(query: Prisma.TagWhereUniqueInput) {
    return await this.dbClient.tag.findUnique({ where: query });
  }

  async findMany(query: Prisma.TagWhereInput, orderBy?: ISortQuery) {
    return await this.dbClient.tag.findMany({ where: query, orderBy });
  }

  async updateOne(
    query: Prisma.TagWhereUniqueInput,
    data: Prisma.TagUpdateInput,
  ) {
    return await this.dbClient.tag.update({ where: query, data });
  }

  async deleteOne(query: Prisma.TagWhereUniqueInput) {
    return await this.dbClient.tag.delete({ where: query });
  }
}

export const tagRepository = new TagRepository(prismaClient);
