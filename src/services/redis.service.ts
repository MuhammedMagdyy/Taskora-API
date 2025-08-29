import { redisClient } from '../database';
import { ApiError, INTERNAL_SERVER_ERROR } from '../utils';

export class RedisService {
  async set(key: string, value: any, expiryInSeconds?: number) {
    try {
      const serializedValue =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (expiryInSeconds) {
        await redisClient.setEx(key, expiryInSeconds, serializedValue);
      } else {
        await redisClient.set(key, serializedValue);
      }
    } catch {
      throw new ApiError('Failed to set value in Redis', INTERNAL_SERVER_ERROR);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);

      if (!value) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch {
      throw new ApiError(
        'Failed to get value from Redis',
        INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(key: string) {
    try {
      await redisClient.del(key);
    } catch {
      throw new ApiError(
        'Failed to delete value from Redis',
        INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);

      return result === 1;
    } catch {
      throw new ApiError(
        'Failed to check if value exists in Redis',
        INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const redisService = new RedisService();
