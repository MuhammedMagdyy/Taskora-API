import { Queue } from 'bullmq';
import { redisHost, redisPort } from '../config';

export const answerQueue = new Queue('answerQueue', {
  connection: { host: redisHost, port: Number(redisPort) },
});
