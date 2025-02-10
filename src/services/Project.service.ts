import { Prisma } from '@prisma/client';
import { projectRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';
import { ISortQuery } from '../types';

export class ProjectService {
  constructor(private readonly projectDataSource = projectRepository) {}

  async createOne(data: Prisma.ProjectUncheckedCreateInput) {
    return this.projectDataSource.createOne(data);
  }

  async findOne(query: Prisma.ProjectWhereUniqueInput) {
    return this.projectDataSource.findOne(query);
  }

  async findMany(query: Prisma.ProjectWhereInput, sort?: ISortQuery) {
    return this.projectDataSource.findMany(query, sort);
  }

  async updateOne(
    query: Prisma.ProjectWhereUniqueInput,
    data: Prisma.ProjectUncheckedUpdateInput
  ) {
    return this.projectDataSource.updateOne(query, data);
  }

  async deleteOne(query: Prisma.ProjectWhereUniqueInput) {
    return this.projectDataSource.deleteOne(query);
  }

  async isProjectExists(uuid: string) {
    const project = await this.findOne({ uuid });
    if (!project) {
      throw new ApiError('Project not found', NOT_FOUND);
    }
    return project;
  }

  async deleteProjectByUUID(uuid: string) {
    await this.isProjectExists(uuid);
    await this.deleteOne({ uuid });
  }
}

export const projectSerivce = new ProjectService();
