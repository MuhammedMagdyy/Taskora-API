import winston from 'winston';
import { nodeEnv } from '../config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} [${info.level}]: ${info.message}${info.meta ? ` ${JSON.stringify(info.meta)}` : ''}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: fileFormat,
  }),
  new winston.transports.File({
    filename: 'logs/all.log',
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === nodeEnv ? 'debug' : 'info',
  levels,
  transports,
});

export { logger };
