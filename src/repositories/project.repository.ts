import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

export class ProjectRepository {
  constructor(private readonly dbClient: PrismaClient) {}

  async createOne(data: Prisma.ProjectUncheckedCreateInput) {
    return this.dbClient.project.create({ data });
  }

  async findOne(query: Prisma.ProjectWhereUniqueInput) {
    return this.dbClient.project.findUnique({ where: query });
  }

  async findMany(query: Prisma.ProjectWhereInput) {
    return this.dbClient.project.findMany({
      where: query,
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateOne(
    query: Prisma.ProjectWhereUniqueInput,
    data: Prisma.ProjectUncheckedUpdateInput,
  ) {
    return this.dbClient.project.update({ where: query, data });
  }

  async deleteOne(query: Prisma.ProjectWhereUniqueInput) {
    return this.dbClient.project.delete({ where: query });
  }
}

export const projectRepository = new ProjectRepository(prismaClient);
