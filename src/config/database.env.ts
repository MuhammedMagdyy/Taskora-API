import env from './env';

export const databaseUrl = env('DATABASE_URL');
export const redisUrl = env('REDIS_URL');
