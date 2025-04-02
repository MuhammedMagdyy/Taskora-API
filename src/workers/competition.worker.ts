import { Worker } from 'bullmq';
import { answerQueue } from '../queues';
import { CompetitionService } from '../services';

export const answerWorker = new Worker(
  'answerQueue',
  async (job) => {
    return await CompetitionService.processAnswer(
      job.data.userId,
      job.data.answerId,
    );
  },
  { connection: answerQueue.opts.connection },
);
