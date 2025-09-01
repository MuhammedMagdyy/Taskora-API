import { Queue } from 'bullmq';
import { redisHost, redisPort } from '../config';
import { EmailJobData } from '../types';
import { QUEUES } from '../utils';

export const emailQueue = new Queue<EmailJobData>(QUEUES.EMAIL_QUEUE, {
  connection: { host: redisHost, port: Number(redisPort) },
});
