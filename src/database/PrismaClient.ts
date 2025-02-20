import { PrismaClient } from '@prisma/client';
import { IDatabaseClient } from '../interfaces';
import { logger } from '../utils';

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
      logger.info(`Prisma connected successfully! ✅`);
    } catch (error) {
      logger.error(`Prisma connection failed - ${error} ❌`);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.getClient().$disconnect();
      logger.info(`Prisma disconnected successfully! ❌`);
    } catch (error) {
      logger.error(`Prisma disconnection failed - ${error} ❌`);
    }
  }
}

export const prismaClient = PrismaDatabaseClient.getInstance().getClient();
