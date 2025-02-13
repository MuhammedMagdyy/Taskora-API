import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import colors from 'colors';
import compression from 'compression';
import swaggerDocument from '../swagger.json';
import routes from './routes';
import { errorHandler, xss } from './middlewares';
import { nodeEnv, port, corsConfig } from './config';
import { SERVER, INTERNAL_SERVER_ERROR } from './utils';
import { PrismaDatabaseClient, RedisDatabaseClient } from './database';
import { refreshTokenService } from './services';

const app = express();
const prismaClient = PrismaDatabaseClient.getInstance();
const redisClient = RedisDatabaseClient.getInstance();
const logger =
  nodeEnv === SERVER.DEVELOPMENT
    ? morgan('dev')
    : morgan('combined', {
        skip: (_, res) => res.statusCode < INTERNAL_SERVER_ERROR,
      });

app.use(logger);
app.use(helmet());
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json());
app.use(xss);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes);
app.use(errorHandler);

export const up = async () => {
  try {
    await Promise.all([prismaClient.connect(), redisClient.connect()]);
    refreshTokenService.scheduleTokenCleanupTask();

    const server = app.listen(port, () => {
      console.log(
        colors.green(
          `Server is running on ${port || SERVER.DEFAULT_PORT_NUMBER} 🚀`
        )
      );
    });

    process.on('SIGINT', async () => {
      console.log(colors.yellow('\nShutting down gracefully...'));

      await Promise.all([prismaClient.disconnect(), redisClient.disconnect()]);

      server.close(() => {
        console.log(colors.yellow('Server closed successfully! 👋'));
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(
      colors.red(`Error occurred while starting the server - ${error} ❌`)
    );
    process.exit(1);
  }
};
