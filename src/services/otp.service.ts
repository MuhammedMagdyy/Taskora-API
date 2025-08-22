import { Prisma } from '@prisma/client';
import { otpRepository } from '../repositories';

export class OtpService {
  constructor(private readonly otpDataSource = otpRepository) {}

  async createOne(data: Prisma.GeneratedOtpUncheckedCreateInput) {
    return this.otpDataSource.createOne(data);
  }

  async findOneByHashedOtp(otp: string) {
    return this.otpDataSource.findOne({ otp });
  }
}

export const otpService = new OtpService();
