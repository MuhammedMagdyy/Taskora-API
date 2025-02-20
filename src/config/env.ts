import { logger } from '../utils';

function env(name: string, required?: true): string;

function env(name: string, required: false): string | undefined;

function env(name: string, required = true): string | undefined {
  const value = process.env[name];

  if (required && !value) {
    logger.error(`Environment variable ${name} is required but not found.`);
    process.exit(1);
  }

  return value;
}

export default env;
