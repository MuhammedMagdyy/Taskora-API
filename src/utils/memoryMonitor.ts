import { logger } from './logger';

export class MemoryMonitor {
  private static monitoringInterval: NodeJS.Timeout | null = null;

  static start(intervalMs: number = 60000) {
    if (this.monitoringInterval) {
      return;
    }

    this.monitoringInterval = setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsedMB =
        Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100;
      const heapTotalMB =
        Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100;
      const heapUsedPercent = Math.round((heapUsedMB / heapTotalMB) * 100);

      if (heapUsedPercent > 85) {
        logger.warn(
          `High memory usage detected: ${heapUsedMB}MB/${heapTotalMB}MB (${heapUsedPercent}%)`,
        );
        if (global.gc && heapUsedPercent > 95) {
          global.gc();
          logger.info('Forced garbage collection executed');
        }
      }
    }, intervalMs);

    logger.info('Memory monitoring started');
  }

  static stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logger.info('Memory monitoring stopped');
    }
  }

  static getMemoryUsage() {
    const memUsage = process.memoryUsage();
    return {
      heapUsed: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotal: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
      heapUsedPercent: Math.round(
        (memUsage.heapUsed / memUsage.heapTotal) * 100,
      ),
      external: Math.round((memUsage.external / 1024 / 1024) * 100) / 100,
      rss: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
    };
  }
}
