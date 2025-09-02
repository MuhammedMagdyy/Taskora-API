import { logger } from './logger';

export async function retryAndBackoff<T>(
  fn: () => Promise<T>,
  serviceName: string,
  maxRetries = 10,
  baseDelay = 500,
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await fn();
      logger.info(`${serviceName} connected successfully! ✅`);
      return result;
    } catch (error) {
      attempt++;
      logger.error(
        `${serviceName} connection attempt ${attempt} failed: ${error}`,
      );

      if (attempt >= maxRetries) {
        logger.error(`Max retries reached for ${serviceName}. Exiting... ❌`);
        process.exit(1);
      }

      const delay = baseDelay * Math.pow(2, attempt);
      logger.info(`Retrying ${serviceName} in ${delay} ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(
    `${serviceName} connection failed after ${maxRetries} retries`,
  );
}
