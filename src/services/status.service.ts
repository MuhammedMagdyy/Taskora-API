import { Prisma } from '@prisma/client';
import { statusRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';
import { redisService } from './redis.service';

export class StatusService {
  private readonly cacheKey = 'statuses';

  constructor(private readonly statusDataSource = statusRepository) {}

  async createMany(data: Prisma.StatusCreateManyInput[]) {
    await redisService.delete(this.cacheKey);

    return this.statusDataSource.createMany(data);
  }

  async findOne(query: Prisma.StatusWhereUniqueInput) {
    return this.statusDataSource.findOne(query);
  }

  async findMany() {
    const cached = await redisService.get<string[]>(this.cacheKey);
    if (cached) return cached;

    const statuses = await this.statusDataSource.findMany();
    await redisService.set(this.cacheKey, statuses);

    return statuses;
  }

  async isStatusExists(uuid: string) {
    const status = await this.findOne({ uuid });
    if (!status) {
      throw new ApiError('Status not found', NOT_FOUND);
    }
    return status;
  }

  async getStatusCount() {
    return this.statusDataSource.getStatusCount();
  }
}

export const statusService = new StatusService();
