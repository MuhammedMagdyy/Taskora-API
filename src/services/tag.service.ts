import { Prisma } from '@prisma/client';
import { tagRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';

export class TagService {
  constructor(private readonly tagDataSource = tagRepository) {}

  async createOne(data: Prisma.TagUncheckedCreateInput) {
    return this.tagDataSource.createOne(data);
  }

  async findOne(query: Prisma.TagWhereUniqueInput) {
    return this.tagDataSource.findOne(query);
  }

  async findMany(query: Prisma.TagWhereInput) {
    return this.tagDataSource.findMany(query);
  }

  async updateOne(
    query: Prisma.TagWhereUniqueInput,
    data: Prisma.TagUpdateInput,
  ) {
    return this.tagDataSource.updateOne(query, data);
  }

  async deleteOne(query: Prisma.TagWhereUniqueInput) {
    return this.tagDataSource.deleteOne(query);
  }

  async isTagExists(uuid: string, userUuid: string) {
    const tag = await this.findOne({ uuid, userUuid });
    if (!tag) {
      throw new ApiError('Tag not found', NOT_FOUND);
    }
    return tag;
  }

  async updateTagByUuid(
    uuid: string,
    data: Prisma.TagUpdateInput,
    userUuid: string,
  ) {
    await this.isTagExists(uuid, userUuid);
    return this.updateOne({ uuid }, data);
  }

  async deleteTagByUuid(uuid: string, userUuid: string) {
    await this.isTagExists(uuid, userUuid);
    return this.deleteOne({ uuid, userUuid });
  }
}

export const tagService = new TagService();
