import { createQueue } from './createQueue';
import logger from '../utils/logger';
import transferFunds from './workers/transferFunds';

const fundingQueue = createQueue('FundingQueue');

// fundingQueue.process('transferFunds', 2, `${__dirname}/workers/transferFunds.js`);
fundingQueue.process('transferFunds', transferFunds);
fundingQueue.process('checkStatus', 2, `${__dirname}/workers/checkStatus.js`);

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
