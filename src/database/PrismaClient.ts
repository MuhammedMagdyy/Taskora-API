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
    await this.getClient().$connect();
    console.log(colors.green(`Database connected successfully! ✅`));
  }

  async disconnect(): Promise<void> {
    await this.getClient().$disconnect();
    console.log(colors.red(`Database disconnected successfully! ❌`));
  }
}

process.on('SIGINT', async () => {
  await PrismaDatabaseClient.getInstance().disconnect();
  process.exit(0);
});

export const prismaClient = PrismaDatabaseClient.getInstance().getClient();
