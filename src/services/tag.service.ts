import { Prisma } from '@prisma/client';
import { tagRepository } from '../repositories';
import { ApiError, MAGIC_NUMBERS, NOT_FOUND } from '../utils';
import { redisService } from './redis.service';

export class TagService {
  constructor(private readonly tagDataSource = tagRepository) {}

  async createOne(data: Prisma.TagUncheckedCreateInput) {
    await redisService.delete(`tags:${data.userUuid}`);
    return this.tagDataSource.createOne(data);
  }

  async findOne(query: Prisma.TagWhereUniqueInput) {
    return this.tagDataSource.findOne(query);
  }

  async findMany(query: Prisma.TagWhereInput) {
    const cacheKey = `tags:${query.userUuid as string}`;
    const cached = await redisService.get<string[]>(cacheKey);
    if (cached) return cached;

    const tags = await this.tagDataSource.findMany(query);
    await redisService.set(
      cacheKey,
      tags,
      MAGIC_NUMBERS.FIVE_MINUTES_IN_SECONDS,
    );

    return tags;
  }

  async updateOne(
    query: Prisma.TagWhereUniqueInput,
    data: Prisma.TagUpdateInput,
    userUuid: string,
  ) {
    const tag = await this.tagDataSource.updateOne(query, data);
    await redisService.delete(`tags:${userUuid}`);
    return tag;
  }

  async deleteOne(query: Prisma.TagWhereUniqueInput, userUuid: string) {
    await redisService.delete(`tags:${userUuid}`);
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
    return this.updateOne({ uuid }, data, userUuid);
  }

  async deleteTagByUuid(uuid: string, userUuid: string) {
    await this.isTagExists(uuid, userUuid);
    return this.deleteOne({ uuid, userUuid }, userUuid);
  }
}

export const tagService = new TagService();
