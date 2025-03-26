import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';
import {
  CustomProjectUncheckedCreateInput,
  CustomTaskUncheckedCreateInput,
} from '../types/prisma';

export class UserRepository {
  private readonly dbClient: PrismaClient;
  private arabicNumerals: string[] = [
    'الأول',
    'الثاني',
    'الثالث',
    'الرابع',
    'الخامس',
    'السادس',
    'السابع',
    'الثامن',
    'التاسع',
    'العاشر',
    'الحادي عشر',
    'الثاني عشر',
    'الثالث عشر',
    'الرابع عشر',
    'الخامس عشر',
    'السادس عشر',
    'السابع عشر',
    'الثامن عشر',
    'التاسع عشر',
    'العشرون',
    'الحادي والعشرون',
    'الثاني والعشرون',
    'الثالث والعشرون',
    'الرابع والعشرون',
    'الخامس والعشرون',
    'السادس والعشرون',
    'السابع والعشرون',
    'الثامن والعشرون',
    'التاسع والعشرون',
    'الثلاثون',
  ];

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  async createOne(data: Prisma.UserUncheckedCreateInput) {
    return await this.dbClient.user.create({ data });
  }

  async findOne(query: Prisma.UserWhereInput) {
    return await this.dbClient.user.findFirst({ where: query });
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput,
  ) {
    return await this.dbClient.user.update({ where: query, data });
  }

  async initializeUserWithProjectAndTasks(
    userData: Prisma.UserUncheckedCreateInput,
    projectData: CustomProjectUncheckedCreateInput,
    taskData: CustomTaskUncheckedCreateInput,
  ) {
    return await this.dbClient.$transaction(async (dbTransaction) => {
      const inProgressStatusUuid = await dbTransaction.status.findFirst({
        where: { name: 'IN_PROGRESS' },
        select: { uuid: true },
      });

      const user = await dbTransaction.user.create({ data: userData });

      const project = await dbTransaction.project.create({
        data: {
          ...projectData,
          userUuid: user.uuid,
          statusUuid: inProgressStatusUuid?.uuid as string,
        },
      });

      await dbTransaction.task.create({
        data: {
          ...taskData,
          projectUuid: project.uuid,
          userUuid: user.uuid,
          statusUuid: inProgressStatusUuid?.uuid as string,
        },
      });

      return user;
    });
  }

  async ramadanChallenge(userUuid: string) {
    return await this.dbClient.$transaction(async (dbTransaction) => {
      const ramadanStart = new Date('2025-03-01');
      const ramadanEnd = new Date(ramadanStart);
      ramadanEnd.setDate(ramadanStart.getDate() + 29);

      const inProgressStatus = await dbTransaction.status.findFirst({
        where: { name: 'IN_PROGRESS' },
        select: { uuid: true },
      });

      const project = await dbTransaction.project.create({
        data: {
          name: 'ختم القرآن في رمضان',
          description: 'خطة لختم القرآن الكريم خلال شهر رمضان المبارك',
          dueDate: ramadanEnd,
          color: '#ebbc62',
          userUuid,
          theme: 'RAMADAN',
          statusUuid: inProgressStatus?.uuid as string,
        },
      });

      const taskPromises = this.arabicNumerals.map((num, i) => {
        const taskDueDate = new Date(ramadanStart);
        taskDueDate.setDate(ramadanStart.getDate() + i);

        return dbTransaction.task.create({
          data: {
            name: `الجزء ${num}`,
            description: `قراءة الجزء ${num} من القرآن الكريم`,
            dueDate: taskDueDate,
            projectUuid: project.uuid,
            userUuid,
            statusUuid: inProgressStatus?.uuid as string,
          },
        });
      });

      const tasks = await Promise.all(taskPromises);

      return { project, tasks };
    });
  }

  async softDeleteInactiveUsers() {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const softDeleteUsers = await this.dbClient.user.updateMany({
      where: { createdAt: { lt: oneWeekAgo }, isVerified: false },
      data: { deletedAt: now },
    });

    return { totalUsers: softDeleteUsers.count };
  }
}

export const userRepository = new UserRepository(prismaClient);
