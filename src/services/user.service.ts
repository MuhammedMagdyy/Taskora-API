import { Prisma } from '@prisma/client';
import { userRepository } from '../repositories';
import {
  CustomProjectUncheckedCreateInput,
  CustomTaskUncheckedCreateInput,
} from '../types/prisma';

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
}

export const userService = new UserService();
