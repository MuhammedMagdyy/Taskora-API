import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { bullBoardQueuePath } from '../config';
import { emailQueue } from '../queues';

export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(bullBoardQueuePath);

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});
