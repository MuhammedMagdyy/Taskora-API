import { Prisma } from '@prisma/client';
import { tagRepository, TagRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';
import { ISortQuery } from '../types';

export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createOne(data: Prisma.TagUncheckedCreateInput) {
    return await this.tagRepository.createOne(data);
  }

  async findOne(query: Prisma.TagWhereUniqueInput) {
    return await this.tagRepository.findOne(query);
  }

  async findMany(query: Prisma.TagWhereInput, orderBy?: ISortQuery) {
    return await this.tagRepository.findMany(query, orderBy);
  }

  async isTagExists(uuid: string) {
    const tag = await this.findOne({ uuid });
    if (!tag) {
      throw new ApiError('Tag not found', NOT_FOUND);
    }
    return tag;
  }
}

export const tagService = new TagService(tagRepository);
