import { Prisma } from '@prisma/client';
import { statusRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';
import { ISortQuery } from '../types';

export class StatusSerivce {
  constructor(private readonly statusDataSource = statusRepository) {}

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
}

export const statusSerivce = new StatusSerivce();
