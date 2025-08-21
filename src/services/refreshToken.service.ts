import { Prisma } from '@prisma/client';
import cron, { ScheduledTask } from 'node-cron';
import { refreshTokenRepository } from '../repositories';
import { ApiError, logger, UNAUTHORIZED } from '../utils';

export class RefreshTokenService {
  private cleanupTask: ScheduledTask | null = null;

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
    if (this.cleanupTask) {
      return;
    }

    this.cleanupTask = cron.schedule(
      '0 0 * * *',
      () => {
        (async () => {
          try {
            logger.info('Cleanup tokens cron job started 🕛');
            await this.deleteExpiredTokens();
            logger.info('Cleanup tokens cron job completed ✅');

            if (global.gc) {
              global.gc();
            }
          } catch (error) {
            logger.error('Cleanup tokens cron job failed ❌', error);
          }
        })();
      },
      { scheduled: true, timezone: 'UTC' },
    );
  }

  stopCleanupTask() {
    if (this.cleanupTask) {
      this.cleanupTask.stop();
      this.cleanupTask = null;
    }
  }
}

export const refreshTokenService = new RefreshTokenService();
