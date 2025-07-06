import { SERVER } from '../utils';
import env from './env';
import { nodeEnv } from './server.env';

export const databaseUrl = env('DATABASE_URL');
export const redisHost = env('REDIS_HOST');
export const redisPort = env('REDIS_PORT');
export const redisUrl =
  nodeEnv === SERVER.DEVELOPMENT
    ? `redis://${redisHost}:${redisPort}`
    : env('REDIS_URL');
