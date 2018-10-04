import { logger } from '../utils';
import { createQueue } from './createQueue';

const createFundingQueue = () => {
  const queue = createQueue('FundingQueue');
  const { formatLog } = queue;

  queue.process('sendFunds', 1, `${__dirname}/workers/fundChildAccount.js`);

  queue.on('progress', (job, progress) => {
    logger.info(`${formatLog(job)} progress: ${progress}`);
  });

  queue.on('completed', (job, result) => {
    const { name } = job;
    logger.info(`${formatLog(job)} ${name} results: ${JSON.stringify(result)}`);
  });


  return queue;
};

export { createFundingQueue };
