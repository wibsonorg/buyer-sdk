import { createQueue } from './createQueue';
import { addPrepareNotarizationJob } from './notarizationQueue';
import { dataResponses, dataResponsesBatches } from '../utils/stores';
import { logger } from '../utils';
import config from '../../config';

const addDataResponseToBatch = async (batchId, dataResponseId) => {
  const batch = await dataResponsesBatches.safeFetch(batchId, []);
  const dataResponseIds = Array
    .from(new Set([...batch, dataResponseId]))
    .filter(id => id);
  await dataResponsesBatches.store(batchId, dataResponseIds);
  return dataResponseIds;
};

const clearBatch = async batchId => dataResponsesBatches.store(batchId, []);

const queue = createQueue('DataResponseQueue');
export const processDataResponseJob = async (job) => {
  const { data: { orderId, dataResponseId, maximumBatchSize } } = job;

  const dataResponse = await dataResponses.fetch(dataResponseId);
  const { status, notaryAddress } = dataResponse;
  if (status !== 'queued') {
    return dataResponse;
  }

  const batchId = `${orderId}:${notaryAddress}`;
  const dataResponseIds = await addDataResponseToBatch(batchId, dataResponseId);
  if (dataResponseIds.length >= maximumBatchSize) {
    await addPrepareNotarizationJob({ orderId, notaryAddress, dataResponseIds });
    await clearBatch(batchId);
  }

  const updateDataReseponse = { ...dataResponse, status: 'batched' };
  await dataResponses.store(dataResponseId, updateDataReseponse);

  return updateDataReseponse;
};

queue.process(processDataResponseJob);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`DR[${id}] :: Process :: Error thrown: ${failedReason} (will be retried)`);
});

export const addProcessDataResponseJob = params =>
  queue.add({ ...params, ...config.dataResponseQueue });
