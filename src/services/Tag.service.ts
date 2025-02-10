import { Prisma } from '@prisma/client';
import { tagRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';
import { ISortQuery } from '../types';

export class TagService {
  constructor(private readonly tagDataSource = tagRepository) {}

  async createOne(data: Prisma.TagUncheckedCreateInput) {
    return this.tagDataSource.createOne(data);
  }

  async findOne(query: Prisma.TagWhereUniqueInput) {
    return this.tagDataSource.findOne(query);
  }

  async findMany(query: Prisma.TagWhereInput, orderBy?: ISortQuery) {
    return this.tagDataSource.findMany(query, orderBy);
  }

  async isTagExists(uuid: string) {
    const tag = await this.findOne({ uuid });
    if (!tag) {
      throw new ApiError('Tag not found', NOT_FOUND);
    }
    return tag;
  }
}

export const tagService = new TagService();
