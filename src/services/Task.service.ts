import { Prisma } from '@prisma/client';
import { taskRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';
import { ISortQuery } from '../types';

export class TaskService {
  constructor(private readonly taskDataSource = taskRepository) {}

  async createOne(data: Prisma.TaskUncheckedCreateInput) {
    return this.taskDataSource.createOne(data);
  }

  async findOne(query: Prisma.TaskWhereUniqueInput) {
    return this.taskDataSource.findOne(query);
  }

  async findMany(query: Prisma.TaskWhereInput, orderBy?: ISortQuery) {
    return this.taskDataSource.findMany(query, orderBy);
  }

  async updateOne(
    query: Prisma.TaskWhereUniqueInput,
    data: Prisma.TaskUncheckedUpdateInput
  ) {
    return this.taskDataSource.updateOne(query, data);
  }

  async deleteOne(query: Prisma.TaskWhereUniqueInput) {
    return this.taskDataSource.deleteOne(query);
  }

  async isTaskExists(uuid: string) {
    const task = await this.findOne({ uuid });
    if (!task) {
      throw new ApiError('Task not found', NOT_FOUND);
    }
    return task;
  }

  async deleteTaskByUUID(uuid: string) {
    await this.isTaskExists(uuid);
    await this.deleteOne({ uuid });
  }
}

export const taskService = new TaskService();
