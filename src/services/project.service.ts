import { Prisma } from '@prisma/client';
import { projectRepository } from '../repositories';
import { ApiError, MAGIC_NUMBERS, NOT_FOUND } from '../utils';
import { redisService } from './redis.service';

export class ProjectService {
  constructor(private readonly projectDataSource = projectRepository) {}

  async createOne(data: Prisma.ProjectUncheckedCreateInput) {
    await redisService.delete(`projects:${data.userUuid}`);
    return this.projectDataSource.createOne(data);
  }

  async findOne(query: Prisma.ProjectWhereUniqueInput) {
    return this.projectDataSource.findOne(query);
  }

  async findMany(query: Prisma.ProjectWhereInput) {
    const cacheKey = `projects:${query.userUuid as string}`;
    const cached = await redisService.get<string[]>(cacheKey);
    if (cached) return cached;

    const projects = await this.projectDataSource.findMany(query);
    await redisService.set(
      cacheKey,
      projects,
      MAGIC_NUMBERS.FIVE_MINUTES_IN_SECONDS,
    );

    return projects;
  }

  async updateOne(
    query: Prisma.ProjectWhereUniqueInput,
    data: Prisma.ProjectUncheckedUpdateInput,
    userUuid: string,
  ) {
    const project = await this.projectDataSource.updateOne(query, data);
    await redisService.delete(`projects:${userUuid}`);
    return project;
  }

  async deleteOne(query: Prisma.ProjectWhereUniqueInput, userUuid: string) {
    await redisService.delete(`projects:${userUuid}`);
    return this.projectDataSource.deleteOne(query);
  }

  async isProjectExists(uuid: string, userUuid: string) {
    const project = await this.findOne({ uuid, userUuid });
    if (!project) {
      throw new ApiError('Project not found', NOT_FOUND);
    }
    return project;
  }

  async deleteProjectByUUID(uuid: string, userUuid: string) {
    await this.isProjectExists(uuid, userUuid);
    await this.deleteOne({ uuid }, userUuid);
  }
}

export const projectService = new ProjectService();
