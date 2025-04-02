import { Prisma } from '@prisma/client';
import cron from 'node-cron';
import { userRepository } from '../repositories';
import {
  CustomProjectUncheckedCreateInput,
  CustomTaskUncheckedCreateInput,
} from '../types/prisma';
import { ApiError, logger, NOT_FOUND } from '../utils';

export class UserService {
  constructor(private readonly userDataSource = userRepository) {}

  async createOne(data: Prisma.UserUncheckedCreateInput) {
    return this.userDataSource.createOne(data);
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput,
  ) {
    return this.userDataSource.updateOne(query, data);
  }

  async findUserByUUID(uuid: string) {
    return this.userDataSource.findOne({ uuid });
  }

  async findUserByEmail(email: string) {
    return this.userDataSource.findOne({ email });
  }

  async initializeUserWithProjectAndTasks(
    userData: Prisma.UserUncheckedCreateInput,
    projectData: CustomProjectUncheckedCreateInput,
    taskData: CustomTaskUncheckedCreateInput,
  ) {
    return this.userDataSource.initializeUserWithProjectAndTasks(
      userData,
      projectData,
      taskData,
    );
  }

  async ramadanChallenge(userUuid: string) {
    return this.userDataSource.ramadanChallenge(userUuid);
  }

  scheduleUserCleanupTask() {
    cron.schedule('0 0 * * *', () => {
      logger.info(`Running user cleanup task... 🧹`);
      this.userDataSource
        .softDeleteInactiveUsers()
        .then(({ totalUsers }) => {
          logger.info(`Soft deleted ${totalUsers} inactive users ✅`);
        })
        .catch((error) => {
          logger.error(`Error deleting inactive users ❌: ${error}`);
        });
    });
  }

  async getUserInfo(userUuid: string) {
    const user = await this.userDataSource.findOne({ uuid: userUuid });
    if (!user) {
      throw new ApiError('User not found', NOT_FOUND);
    }
    return { name: user.name, email: user.email };
  }
}

export const userService = new UserService();
