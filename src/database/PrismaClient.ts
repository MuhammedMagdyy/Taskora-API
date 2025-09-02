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

  async connect(maxRetries = 10, baseDelay = 500): Promise<void> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await this.getClient().$connect();
        logger.info(`Prisma connected successfully! ✅`);
        return;
      } catch (error) {
        attempt++;
        logger.error(`Prisma connection attempt ${attempt} failed: ${error}`);

        if (attempt >= maxRetries) {
          logger.error(`Max retries reached. Exiting... ❌`);
          process.exit(1);
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        logger.info(`Retrying in ${delay} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
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
