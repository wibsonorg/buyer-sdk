import uuid from 'uuid/v4';
import { createQueue } from './createQueue';
import { addPrepareNotarizationJob } from './notarizationQueue';
import {
  dataResponses,
  dataResponsesAccumulator as accumulator,
  dataResponsesBatches as batches,
} from '../utils/stores';
import { logger } from '../utils';
import config from '../../config';

const createBatch = async (payload) => {
  const id = uuid();
  const batch = { ...payload, status: 'created' };
  await batches.store(id, batch);
  return id;
}

const accumulate = async (accumulatorId, dataResponseId) => {
  const dataResponseIds = await accumulator.safeFetch(accumulatorId, []);
  const newDataResponseIds = Array
    .from(new Set([...dataResponseIds, dataResponseId]))
    .filter(id => id);
  await accumulator.store(accumulatorId, newDataResponseIds);
  return newDataResponseIds;
};

const clear = async batchId => accumulator.store(batchId, []);

const queue = createQueue('DataResponseQueue');

/**
 * This processor expects DataResponses only with status `queued`.
 *
 * @param {Object} job
 */
export const processDataResponseJob = async (job) => {
  const { id, data: { orderId, dataResponseId, maximumBatchSize } } = job;

  const dataResponse = await dataResponses.fetch(dataResponseId);
  const { status, notaryAddress } = dataResponse;
  if (status !== 'queued') {
    logger.warn(`DR[${id}] :: Process :: Cant't process DataResponse (${status})`);
    return dataResponse;
  }

  const accumulatorId = `${orderId}:${notaryAddress}`;
  const dataResponseIds = await accumulate(accumulatorId, dataResponseId);
  if (dataResponseIds.length >= maximumBatchSize) {
    await clear(accumulatorId);
    const batchId = await createBatch(orderId, notaryAddress, dataResponseIds);
    await addPrepareNotarizationJob({ batchId });
  }

  const updateDataReseponse = { ...dataResponse, status: 'batched' };
  await dataResponses.store(dataResponseId, updateDataReseponse);

  return updateDataReseponse;
};

queue.process(processDataResponseJob);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`DR[${id}] :: Process :: ${failedReason} (will be retried)`);
});

export const addProcessDataResponseJob = params =>
  queue.add({ ...params, ...config.dataResponseQueue });
