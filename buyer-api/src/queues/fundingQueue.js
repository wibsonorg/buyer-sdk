import { createQueue } from './createQueue';
import logger from '../utils/logger';
import transferFunds from './workers/transferFunds';

const fundingQueue = createQueue('FundingQueue', {
  limiter: {
    max: 1,
    duration: 10000,
  },
});

fundingQueue.process('transferFunds', 1, transferFunds);

fundingQueue.on('active', async (job) => {
  if (!job.name.startsWith('transfer')) {
    return;
  }

  logger.debug(`Funding Queue :: Processing :: ${job.name}[${job.id}] :: Child #${job.data.child.number} (${job.data.child.address})`);
});

fundingQueue.on('failed', async (job) => {
  if (!job.name.startsWith('transfer')) {
    return;
  }

  logger.debug(`Funding Queue :: Failed     :: ${job.name}[${job.id}] :: Child #${job.data.child.number} (${job.data.child.address}) :: ${job.failedReason}`);
});

fundingQueue.on('completed', async (job) => {
  if (!job.name.startsWith('transfer')) {
    return;
  }

  logger.debug(`Funding Queue :: Completed  :: ${job.name}[${job.id}] :: Child #${job.data.child.number} (${job.data.child.address})`);
});


export { fundingQueue };
