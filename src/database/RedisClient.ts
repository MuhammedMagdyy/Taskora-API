import { createClient, RedisClientType } from 'redis';
import { IDatabaseClient } from '../interfaces';
import { redisUrl } from '../config';
import colors from 'colors';

export class RedisDatabaseClient implements IDatabaseClient {
  private static instance: RedisDatabaseClient;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({ url: redisUrl });
  }

  static getInstance(): RedisDatabaseClient {
    if (!RedisDatabaseClient.instance) {
      RedisDatabaseClient.instance = new RedisDatabaseClient();
    }

    return RedisDatabaseClient.instance;
  }

  getClient() {
    return this.client;
  }

  async connect(): Promise<void> {
    try {
      await this.getClient().connect();
      console.log(colors.green(`Redis connected successfully! ✅`));
    } catch (error) {
      console.error(colors.red(`Redis connection failed - ${error} ❌`));
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.getClient().disconnect();
      console.log(colors.red(`Redis disconnected successfully! ❌`));
    } catch (error) {
      console.error(colors.red(`Redis disconnection failed - ${error} ❌`));
    }
  }
}

export const redisClient = RedisDatabaseClient.getInstance().getClient();
