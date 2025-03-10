import { Prisma } from '@prisma/client';
import cron from 'node-cron';
import { refreshTokenRepository } from '../repositories';
import { ApiError, logger, UNAUTHORIZED } from '../utils';

export class RefreshTokenService {
  constructor(
    private readonly refreshTokenDataSource = refreshTokenRepository,
  ) {}

  async createOne(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return this.refreshTokenDataSource.createOne(data);
  }

  async findOne(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.refreshTokenDataSource.findOne(query);
  }

  async updateOne(
    query: Prisma.RefreshTokenWhereUniqueInput,
    data: Prisma.RefreshTokenUncheckedUpdateInput,
  ) {
    return this.refreshTokenDataSource.updateOne(query, data);
  }

  async deleteOne(query: Prisma.RefreshTokenWhereUniqueInput) {
    return this.refreshTokenDataSource.updateOne(query, {
      isActive: false,
      isDeleted: true,
    });
  }

  async deleteMany(query: Prisma.RefreshTokenWhereInput) {
    return this.refreshTokenDataSource.updateMany(query, {
      isActive: false,
      isDeleted: true,
    });
  }

  async refreshTokenExists(refreshToken: string) {
    const now = new Date();

    const token = await this.findOne({
      token: refreshToken,
      expiresAt: { gt: now },
      isActive: true,
      isDeleted: false,
    });

    if (!token) {
      throw new ApiError('Invalid or expired token', UNAUTHORIZED);
    }

    return token;
  }

  async deleteExpiredTokens() {
    const now = new Date();

    return this.deleteMany({ expiresAt: { lt: now } });
  }

  scheduleTokenCleanupTask() {
    cron.schedule('0 0 * * *', () => {
      logger.info('Cleanup tokens cron job started 🕛');
      this.deleteExpiredTokens()
        .then(() => {
          logger.info('Cleanup tokens cron job completed ✅');
        })
        .catch((error) => {
          logger.error('Cleanup tokens cron job failed ❌', error);
        });
    });
  }
}

export const refreshTokenService = new RefreshTokenService();
