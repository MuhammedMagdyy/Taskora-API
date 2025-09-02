import { createClient, RedisClientType } from 'redis';
import { redisUrl } from '../config';
import { IDatabaseClient } from '../interfaces';
import { logger } from '../utils';

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

  async connect(maxRetries = 10, baseDelay = 500): Promise<void> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await this.getClient().connect();
        logger.info(`Redis connected successfully! ✅`);
        return;
      } catch (error) {
        attempt++;
        logger.error(`Redis connection attempt ${attempt} failed: ${error}`);

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
      await this.getClient().disconnect();
      logger.info(`Redis disconnected successfully! ❌`);
    } catch (error) {
      logger.error(`Redis disconnection failed - ${error} ❌`);
    }
  }
}

export const redisClient = RedisDatabaseClient.getInstance().getClient();
