import { Job, Worker } from 'bullmq';
import 'dotenv/config';
import { redisHost, redisPort } from '../config';
import { emailService } from '../services';
import {
  EmailJobData,
  EmailJobName,
  SendEmailVerificationJob,
  SendForgetPasswordJob,
} from '../types';
import { logger, MAGIC_NUMBERS, QUEUES, WORKERS } from '../utils';

export const emailWorker = new Worker<EmailJobData, void, EmailJobName>(
  QUEUES.EMAIL_QUEUE,
  async (job: Job<EmailJobData, void, EmailJobName>) => {
    switch (job.name) {
      case WORKERS.SEND_VERIFICATION_EMAIL:
        {
          const data = job.data as SendEmailVerificationJob;
          await emailService.sendVerificationEmail(
            data.email,
            data.name,
            data.token,
          );
        }
        break;

      case WORKERS.SEND_FORGET_PASSWORD_EMAIL:
        {
          const data = job.data as SendForgetPasswordJob;
          await emailService.sendForgetPasswordEmail(
            data.email,
            data.name,
            data.otp,
          );
        }
        break;

      default:
        throw new Error(
          `Unknown job name: ${job.name}. Expected: ${Object.values(WORKERS).join(', ')}`,
        );
    }
  },
  {
    connection: { host: redisHost, port: Number(redisPort) },
    concurrency: MAGIC_NUMBERS.MAX_NUMBER_OF_CONCURRENT_JOBS,
  },
);

emailWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} has been completed ✅`);
});

emailWorker.on('failed', (job: Job | undefined, err) => {
  const message = err && err.message ? err.message : err;
  if (job) {
    logger.error(`Job ${job.id} has failed ❌ with error: ${message}`);
  } else {
    logger.error(`Job is undefined ❌ with error: ${message}`);
  }
});

emailWorker.on('error', (err) => {
  logger.error(`Email worker encountered an error: ${err?.message ?? err}`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down email worker gracefully...`);

  try {
    await emailWorker.pause(true);
    logger.info('Worker paused. Waiting for active jobs to finish...');

    await emailWorker.close();
    logger.info('Email worker shutdown complete ✅');
  } catch (err) {
    logger.error(`Error during graceful shutdown: ${err}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
