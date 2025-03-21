import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

export class OtpRepository {
  private readonly dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  async createOne(data: Prisma.GeneratedOtpUncheckedCreateInput) {
    return this.dbClient.generatedOtp.create({ data });
  }
}

export const otpRepository = new OtpRepository(prismaClient);
