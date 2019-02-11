
import { createQueue } from './createQueue';
import { transferNotarizationResult } from '../services/notaryService';
import logger from '../utils/logger';

const process = async ({ id, data: { notarizationRequestId } }) => {
  logger.info(`NR[${id}] :: Process :: ${notarizationRequestId}`);
  return transferNotarizationResult(notarizationRequestId);
};

const queue = createQueue('TranferNotarizationResult');
queue.process(process);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`NR[${id}] :: Process :: ${failedReason} (will be retried)`);
});

export const addNotarizationResultJob = params => queue.add(params);
