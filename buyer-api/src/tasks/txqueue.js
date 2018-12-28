import { transactionQueue } from '../queues/transactionQueue';
import { retryFailed } from '../queues/retryFailed';
import { logger } from '../utils';

export default {
  'txqueue:pause': async () => {
    await transactionQueue.pause();
  },
  'txqueue:resume': async () => {
    await transactionQueue.resume();
  },
  'txqueue:count': async () => {
    const count = await transactionQueue.getJobCounts();
    logger.info('Jobs count', count);
  },
  'txqueue:retry': async () => {
    await retryFailed();
  },
};
