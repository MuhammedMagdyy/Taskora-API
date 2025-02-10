import { Prisma } from '@prisma/client';
import { userRepository } from '../repositories';

export class UserService {
  constructor(private readonly userDataSource = userRepository) {}

  async createOne(data: Prisma.UserUncheckedCreateInput) {
    return this.userDataSource.createOne(data);
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput
  ) {
    return this.userDataSource.updateOne(query, data);
  }

  async findUserByProviderId(providerId: string) {
    return this.userDataSource.findOne({ providerId });
  }

  async findUserByUUID(uuid: string) {
    return this.userDataSource.findOne({ uuid });
  }

  async findUserByEmail(email: string) {
    return this.userDataSource.findOne({ email });
  }
}

export const userService = new UserService();
