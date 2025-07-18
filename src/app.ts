import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { corsConfig, host, nodeEnv, port } from './config';
import {
  createStatusIfNotExists,
  PrismaDatabaseClient,
  RedisDatabaseClient,
} from './database';
import { errorHandler, xss } from './middlewares';
import routes from './routes';
import { refreshTokenService, userService } from './services';
import {
  ApiError,
  INTERNAL_SERVER_ERROR,
  logger,
  NOT_FOUND,
  SERVER,
} from './utils';

const app = express();
const prismaClient = PrismaDatabaseClient.getInstance();
const redisClient = RedisDatabaseClient.getInstance();
const morganLogger =
  nodeEnv === SERVER.DEVELOPMENT
    ? morgan('dev')
    : morgan('combined', {
        skip: (_, res) => res.statusCode < INTERNAL_SERVER_ERROR,
      });

app.get('/', (_, res) => {
  res.send(
    '<div style="text-align: center; margin-top: 20px;"><h1>Welcome to Taskora API 🚀</h1></div>',
  );
});

app.set('trust proxy', 1);
app.use(morganLogger);
app.use(helmet());
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(xss);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes);
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

    const server = app.listen(Number(port), host || '127.0.0.1', () => {
      logger.info(
        `Server is running on ${port || SERVER.DEFAULT_PORT_NUMBER} 🚀`,
      );
    });

    process.on('SIGINT', () => {
      logger.warn('Shutting down gracefully...');

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
