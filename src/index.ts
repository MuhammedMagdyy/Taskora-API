import * as server from './app';
import { logger } from './utils';

server.up().catch((error) => {
  logger.error(`Error occurred while starting the server: ${error} ❌`);
  process.exit(1);
});
