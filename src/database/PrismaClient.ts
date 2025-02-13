import { PrismaClient } from '@prisma/client';
import { IDatabaseClient } from '../interfaces';
import colors from 'colors';

export class PrismaDatabaseClient implements IDatabaseClient {
  private static instance: PrismaDatabaseClient;
  private client: PrismaClient;

  private constructor() {
    this.client = new PrismaClient();
  }

  static getInstance(): PrismaDatabaseClient {
    if (!PrismaDatabaseClient.instance) {
      PrismaDatabaseClient.instance = new PrismaDatabaseClient();
    }

    return PrismaDatabaseClient.instance;
  }

  getClient() {
    return this.client;
  }

  async connect(): Promise<void> {
    try {
      await this.getClient().$connect();
      console.log(colors.green(`Prisma connected successfully! ✅`));
    } catch (error) {
      console.error(colors.red(`Prisma connection failed - ${error} ❌`));
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.getClient().$disconnect();
      console.log(colors.red(`Prisma disconnected successfully! ❌`));
    } catch (error) {
      console.error(colors.red(`Prisma disconnection failed - ${error} ❌`));
    }
  }
}

export const prismaClient = PrismaDatabaseClient.getInstance().getClient();
