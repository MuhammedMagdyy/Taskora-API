import env from './env';

export const nodeEnv = env('NODE_ENV');
export const port = env('PORT');
export const host = env('HOST');
export const memoryMonitorIntervalMs = env('MEMORY_MONITOR_INTERVAL_MS');
