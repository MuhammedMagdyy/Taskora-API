import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../database/client';
import { ISortQuery } from '../types';

export class TagRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createOne(data: Prisma.TagUncheckedCreateInput) {
    return await this.prisma.tag.create({ data });
  }

  async findOne(query: Prisma.TagWhereUniqueInput) {
    return await this.prisma.tag.findUnique({ where: query });
  }

  async findMany(query: Prisma.TagWhereInput, orderBy?: ISortQuery) {
    return await this.prisma.tag.findMany({ where: query, orderBy });
  }
}

export const tagRepository = new TagRepository(prisma);
