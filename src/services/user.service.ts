import { Prisma } from '@prisma/client';
import cron, { ScheduledTask } from 'node-cron';
import { userRepository } from '../repositories';
import { cloudinaryService, HashingService } from '../services';
import {
  CustomProjectUncheckedCreateInput,
  CustomTaskUncheckedCreateInput,
} from '../types/prisma';
import { ApiError, BAD_REQUEST, FORBIDDEN, logger, NOT_FOUND } from '../utils';

export class UserService {
  private cleanupTask: ScheduledTask | null = null;

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
    if (this.cleanupTask) {
      return;
    }

    this.cleanupTask = cron.schedule(
      '0 0 * * *',
      () => {
        (async () => {
          try {
            logger.info('Running user cleanup task... 🧹');
            const { totalUsers } =
              await this.userDataSource.softDeleteInactiveUsers();
            logger.info(`Soft deleted ${totalUsers} inactive users ✅`);

            if (global.gc) {
              global.gc();
            }
          } catch (error) {
            logger.error(`Error deleting inactive users ❌: ${error}`);
          }
        })();
      },
      { scheduled: true, timezone: 'UTC' },
    );
  }

  stopCleanupTask() {
    if (this.cleanupTask) {
      this.cleanupTask.stop();
      this.cleanupTask = null;
    }
  }

  async getUserInfo(userUuid: string) {
    const user = await this.findUserByUUID(userUuid);
    if (!user) {
      throw new ApiError('User not found', NOT_FOUND);
    }

    return {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      picture: user.picture,
      hasPassword: user.password ? true : false,
      createdAt: user.createdAt,
    };
  }

  async updateUserInfo(
    currentUserUuid: string,
    userUuid: string,
    data: Prisma.UserUncheckedUpdateInput,
    file?: Express.Multer.File,
  ) {
    if (currentUserUuid !== userUuid) {
      throw new ApiError(
        'You are not allowed to access this resource',
        FORBIDDEN,
      );
    }

    const user = await this.findUserByUUID(userUuid);
    if (!user) {
      throw new ApiError('User not found', NOT_FOUND);
    }

    let picture = user.picture;
    if (file) {
      const { image } = await cloudinaryService.uploadImage(file.path);
      picture = image;
    }

    if (data.password) {
      const isSamePassword = await HashingService.compare(
        data.password as string,
        user.password as string,
      );

      if (isSamePassword) {
        throw new ApiError(
          'New password must be different from the current one',
          BAD_REQUEST,
        );
      }

      data.password = await HashingService.hash(data.password as string);
    }

    await this.updateOne({ uuid: userUuid }, { ...data, picture });
  }
}

export const userService = new UserService();
