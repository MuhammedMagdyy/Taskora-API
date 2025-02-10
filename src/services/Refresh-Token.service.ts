import { Prisma } from '@prisma/client';
import { refreshTokenRepository } from '../repositories';
import { ApiError, UNAUTHORIZED } from '../utils';
import cron from 'node-cron';
import colors from 'colors';

export class RefreshTokenService {
  constructor(
    private readonly refreshTokenDataSource = refreshTokenRepository
  ) {}

  async createOne(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return this.refreshTokenDataSource.createOne(data);
  }

  async findOne(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.refreshTokenDataSource.findOne(query);
  }

  async updateOne(
    query: Prisma.RefreshTokenWhereUniqueInput,
    data: Prisma.RefreshTokenUncheckedUpdateInput
  ) {
    return this.refreshTokenDataSource.updateOne(query, data);
  }

  async deleteOne(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.refreshTokenDataSource.deleteOne(query);
  }

  async deleteMany(query: Prisma.RefreshTokenWhereInput) {
    return this.refreshTokenDataSource.deleteMany(query);
  }

  async refreshTokenExists(refreshToken: string) {
    const token = await this.findOne({ token: refreshToken });

    if (!token) {
      throw new ApiError('Invalid or expired token', UNAUTHORIZED);
    }

    if (token.expiresAt < new Date()) {
      throw new ApiError('Invalid or expired token', UNAUTHORIZED);
    }

    return token;
  }

  async deleteExpiredTokens() {
    const now = new Date();

    return this.deleteMany({ expiresAt: { lt: now } });
  }

  async scheduleTokenCleanupTask() {
    cron.schedule('0 0 * * *', async () => {
      console.log(colors.yellow('Cleanup tokens cron job started 🕛'));
      await this.deleteExpiredTokens();
      console.log(colors.green('Cleanup tokens cron job completed ✅'));
    });
  }
}

export const refreshTokenService = new RefreshTokenService();
