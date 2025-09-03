import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import {
  bullBoardQueuePath,
  corsConfig,
  host,
  memoryMonitorIntervalMs,
  morganLogger,
  nodeEnv,
  port,
} from './config';
import {
  createStatusIfNotExists,
  PrismaDatabaseClient,
  RedisDatabaseClient,
} from './database';
import { errorHandler, xss } from './middlewares';
import { serverAdapter } from './monitoring';
import routes from './routes';
import { refreshTokenService, userService } from './services';
import { ApiError, logger, MemoryMonitor, NOT_FOUND, SERVER } from './utils';

const app = express();
const prismaClient = PrismaDatabaseClient.getInstance();
const redisClient = RedisDatabaseClient.getInstance();

app.set('trust proxy', 1);
app.use(morganLogger);
app.use(helmet());
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(xss);
if (nodeEnv !== SERVER.PRODUCTION) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.get('/', (_, res) => {
  res.send(SERVER.HTML_RESPONSE);
});
app.use('/api/v1', routes);
app.use(bullBoardQueuePath, serverAdapter.getRouter());
app.all('*', (req, _res, next) => {
  logger.error(`${req.method} ${req.originalUrl} not found`);
  return next(
    new ApiError(
      `Seems like you're lost 🧐 - ${req.method} ${req.originalUrl} not found ❌`,
      NOT_FOUND,
    ),
  );
});
app.use(errorHandler);

export const up = async () => {
  try {
    await Promise.all([
      prismaClient.connect(),
      redisClient.connect(),
      createStatusIfNotExists(),
    ]);
    refreshTokenService.scheduleTokenCleanupTask();
    userService.scheduleUserCleanupTask();

    const intervalMs = Number.parseInt(memoryMonitorIntervalMs, 10);
    MemoryMonitor.start(
      Number.isNaN(intervalMs)
        ? SERVER.DEFAULT_MEMORY_MONITOR_INTERVAL_MS
        : intervalMs,
    );

    const server = app.listen(Number(port), host || SERVER.DEFAULT_HOST, () => {
      logger.info(
        `Server is running on ${port || SERVER.DEFAULT_PORT_NUMBER} 🚀`,
      );
    });

    process.on('SIGINT', () => {
      logger.warn('Shutting down gracefully...');

      refreshTokenService.stopCleanupTask();
      userService.stopCleanupTask();

      MemoryMonitor.stop();
      Promise.all([prismaClient.disconnect(), redisClient.disconnect()])
        .then(() => {
          server.close(() => {
            logger.info('Server closed successfully! 👋');
            process.exit(0);
          });
        })
        .catch((error) => {
          logger.error(`Error occurred during shutdown - ${error} ❌`);
          process.exit(1);
        });
    });
  } catch (error) {
    logger.error(`Error occurred while starting the server - ${error} ❌`);
    process.exit(1);
  }
};
