import env from './env';

export const databaseUrl = env('DATABASE_URL');
export const redisHost = env('REDIS_HOST');
export const redisPort = env('REDIS_PORT');
export const redisUrl = env('REDIS_URL') || `redis://${redisHost}:${redisPort}`;
