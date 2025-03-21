import { Prisma } from '@prisma/client';
import { otpRepository } from '../repositories';

export class OtpService {
  constructor(private readonly otpDataSource = otpRepository) {}

  async createOne(data: Prisma.GeneratedOtpUncheckedCreateInput) {
    return this.otpDataSource.createOne(data);
  }
}

export const otpService = new OtpService();
