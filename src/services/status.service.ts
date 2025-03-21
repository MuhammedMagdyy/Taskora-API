import { Prisma } from '@prisma/client';
import { statusRepository } from '../repositories';
import { ISortQuery } from '../types';
import { ApiError, NOT_FOUND } from '../utils';

export class StatusService {
  constructor(private readonly statusDataSource = statusRepository) {}

  async createMany(data: Prisma.StatusCreateManyInput[]) {
    return this.statusDataSource.createMany(data);
  }

  async findOne(query: Prisma.StatusWhereUniqueInput) {
    return this.statusDataSource.findOne(query);
  }

  async findMany(orderBy?: ISortQuery) {
    return this.statusDataSource.findMany(orderBy);
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
