
import { createQueue } from './createQueue';
import { transferNotarizacionResult } from '../services/notaryService';
import { logger } from '../utils';

const process = async ({ id, data: { notarizationResult } }) => {
  logger.info(`DR[${id}] :: Process :: ${notarizationResult}`);
  return transferNotarizacionResult(notarizationResult);
};

const createTranferNotarizationResultQueue = () => {
  const queue = createQueue('TranferNotarizationResult');

  queue.process(process);

  queue.on('failed', ({ id, failedReason }) => {
    logger.error(`DR[${id}] :: Process :: Error thrown: ${failedReason} (will be retried)`);
  });

  return queue;
};

const queue = createTranferNotarizationResultQueue();

const addNotarizacionResultJob = notarizationResult =>
  queue.add({ notarizationResult });

export { addNotarizacionResultJob, queue as tranferNotarizationResultQueue };
