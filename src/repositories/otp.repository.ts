import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

export class OtpRepository {
  constructor(private readonly dbClient: PrismaClient) {}

  async createOne(data: Prisma.GeneratedOtpUncheckedCreateInput) {
    return this.dbClient.generatedOtp.create({ data });
  }
}

export const otpRepository = new OtpRepository(prismaClient);
