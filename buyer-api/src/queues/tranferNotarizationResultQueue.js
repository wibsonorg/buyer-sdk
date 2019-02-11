
import { createQueue } from './createQueue';
import { transferNotarizacionResult } from '../services/notaryService';
import logger from '../utils/logger';

const process = async ({ id, data: { notarizationRequestId } }) => {
  logger.info(`DR[${id}] :: Process :: ${notarizationRequestId}`);
  return transferNotarizacionResult(notarizationRequestId);
};

const queue = createQueue('TranferNotarizationResult');
queue.process(process);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`DR[${id}] :: Process :: ${failedReason} (will be retried)`);
});

export const addNotarizationResultJob = notarizationResult =>
  queue.add({ notarizationResult });
