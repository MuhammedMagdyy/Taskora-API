import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

export class RefreshTokenRepository {
  private readonly dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  async createOne(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return this.dbClient.refreshToken.create({ data });
  }

  async findOne(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.dbClient.refreshToken.findUnique({ where: query });
  }

  async updateOne(
    query: Prisma.RefreshTokenWhereUniqueInput,
    data: Prisma.RefreshTokenUncheckedUpdateInput,
  ) {
    return this.dbClient.refreshToken.update({ where: query, data });
  }

  async updateMany(
    query: Prisma.RefreshTokenWhereInput,
    data: Prisma.RefreshTokenUncheckedUpdateManyInput,
  ) {
    return this.dbClient.refreshToken.updateMany({ where: query, data });
  }

  async deleteOne(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.dbClient.refreshToken.delete({ where: query });
  }

  async deleteMany(query: Prisma.RefreshTokenWhereInput) {
    return this.dbClient.refreshToken.deleteMany({ where: query });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository(prismaClient);
