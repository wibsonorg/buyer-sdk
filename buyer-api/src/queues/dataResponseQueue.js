import { createQueue } from './createQueue';
import { logger } from '../utils';

const queue = createQueue('DataResponseQueue');
export const processDataResponseJob = async ({ id, data: { dataResponseId } }) => {
  logger.info(`DR[${id}] :: Process :: ${dataResponseId} fake implementation`);
  return true;
}

queue.process(processDataResponseJob);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`DR[${id}] :: Process :: Error thrown: ${failedReason} (will be retried)`);
});

export const addProcessDataResponseJob = (dataResponseId) =>
  queue.add({ dataResponseId });
