import * as server from './app';
import colors from 'colors';

server.up().catch((error) => {
  console.error(
    colors.red(`Error occurred while starting the server: ${error} ❌`)
  );
  process.exit(1);
});
