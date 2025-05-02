import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

export class OtpRepository {
  constructor(private readonly dbClient: PrismaClient) {}

  async createOne(data: Prisma.GeneratedOtpUncheckedCreateInput) {
    return this.dbClient.generatedOtp.create({ data });
  }

  async findOne(where: Prisma.GeneratedOtpWhereUniqueInput) {
    return this.dbClient.generatedOtp.findUnique({ where });
  }
}

export const otpRepository = new OtpRepository(prismaClient);
