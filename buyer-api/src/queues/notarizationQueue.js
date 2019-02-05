import { createQueue } from './createQueue';
import { logger } from '../utils';

const queue = createQueue('NotarizationQueue');

export const prepare = async ({ id }) => {
  logger.info(`N[${id}] :: Prepare :: fake implementation`);
  return true;
};

export const request = async ({ id }) => {
  logger.info(`N[${id}] :: Request :: fake implementation`);
  return true;
};

queue.process('prepare', prepare);
queue.process('request', request);
queue.on('failed', ({ id, name, failedReason }) => {
  logger.error(`N[${id}] :: ${name} :: Error thrown: ${failedReason} (will be retried)`);
});

export const addPrepareNotarizationJob = params => queue.add('prepare', params);
export const addRequestNotarizationJob = params => queue.add('request', params);
