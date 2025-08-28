import { Prisma } from '@prisma/client';
import { taskRepository } from '../repositories';
import { ApiError, MAGIC_NUMBERS, NOT_FOUND } from '../utils';
import { redisService } from './redis.service';

export class TaskService {
  constructor(private readonly taskDataSource = taskRepository) {}

  async createOne(data: Prisma.TaskUncheckedCreateInput) {
    await redisService.delete(`tasks:${data.userUuid}`);
    return this.taskDataSource.createOne(data);
  }

  async findOne(query: Prisma.TaskWhereUniqueInput) {
    return this.taskDataSource.findOne(query);
  }

  async findMany(query: Prisma.TaskWhereInput) {
    const cacheKey = `tasks:${query.userUuid as string}`;
    const cached = await redisService.get<string[]>(cacheKey);
    if (cached) return cached;

    const tasks = await this.taskDataSource.findMany(query);
    await redisService.set(
      cacheKey,
      tasks,
      MAGIC_NUMBERS.FIVE_MINUTES_IN_SECONDS,
    );

    return tasks;
  }

  async updateOne(
    query: Prisma.TaskWhereUniqueInput,
    data: Prisma.TaskUncheckedUpdateInput,
    userUuid: string,
  ) {
    const task = await this.taskDataSource.updateOne(query, data);
    await redisService.delete(`tasks:${userUuid}`);
    return task;
  }

  async deleteOne(query: Prisma.TaskWhereUniqueInput, userUuid: string) {
    await redisService.delete(`tasks:${userUuid}`);
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
    await this.deleteOne({ uuid }, userUuid);
  }
}

export const taskService = new TaskService();
