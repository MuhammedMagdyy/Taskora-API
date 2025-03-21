import winston from 'winston';
import { SERVER } from './constants';

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
});

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({ timestamp, level, message, meta }) =>
      `${timestamp} [${level}]: ${message}${meta ? ` ${JSON.stringify(meta)}` : ''}`,
  ),
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === SERVER.PRODUCTION ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({ format }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: 'logs/all.log',
      format: winston.format.json(),
    }),
  ],
});

export { logger };
