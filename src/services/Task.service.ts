import { Prisma } from '@prisma/client';
import { taskRepository, TaskRepository } from '../repositories';
import { ApiError, NOT_FOUND } from '../utils';
import { ISortQuery } from '../types';

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createOne(data: Prisma.TaskUncheckedCreateInput) {
    return await this.taskRepository.createOne(data);
  }

  async findOne(query: Prisma.TaskWhereUniqueInput) {
    return await this.taskRepository.findOne(query);
  }

  async findMany(query: Prisma.TaskWhereInput, orderBy?: ISortQuery) {
    return await this.taskRepository.findMany(query, orderBy);
  }

  async updateOne(
    query: Prisma.TaskWhereUniqueInput,
    data: Prisma.TaskUncheckedUpdateInput
  ) {
    return await this.taskRepository.updateOne(query, data);
  }

  async deleteOne(query: Prisma.TaskWhereUniqueInput) {
    return await this.taskRepository.deleteOne(query);
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

export const taskService = new TaskService(taskRepository);
