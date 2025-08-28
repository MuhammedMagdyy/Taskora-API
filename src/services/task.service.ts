import { Prisma } from '@prisma/client';
import { taskRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';

export class TaskService {
  constructor(private readonly taskDataSource = taskRepository) {}

  async createOne(data: Prisma.TaskUncheckedCreateInput) {
    return this.taskDataSource.createOne(data);
  }

  async findOne(query: Prisma.TaskWhereUniqueInput) {
    return this.taskDataSource.findOne(query);
  }

  async findMany(query: Prisma.TaskWhereInput) {
    return this.taskDataSource.findMany(query);
  }

  async updateOne(
    query: Prisma.TaskWhereUniqueInput,
    data: Prisma.TaskUncheckedUpdateInput,
  ) {
    return this.taskDataSource.updateOne(query, data);
  }

  async deleteOne(query: Prisma.TaskWhereUniqueInput) {
    return this.taskDataSource.deleteOne(query);
  }

  async isTaskExists(uuid: string, userUuid: string) {
    const task = await this.findOne({ uuid, userUuid });
    if (!task) {
      throw new ApiError('Task not found', NOT_FOUND);
    }
    return task;
  }

  async deleteTaskByUUID(uuid: string, userUuid: string) {
    await this.isTaskExists(uuid, userUuid);
    await this.deleteOne({ uuid });
  }
}

export const taskService = new TaskService();
