import uuid from 'uuid/v4';
import { createQueue } from './createQueue';
import { addPrepareNotarizationJob } from './notarizationQueue';
import {
  dataResponses,
  dataResponsesAccumulator as accumulator,
  dataResponsesBatches as batches,
  dataResponsesLastAdded,
} from '../utils/stores';
import logger from '../utils/logger';
import config from '../../config';

/**
 * @async
 * @function createBatch Batch factory function
 * @param {number} payload.orderId DataOrder's id in the DataExchange
 * @param {string} payload.notaryAddress Notary's Ethereum address
 * @param {string[]} payload.dataResponseIds List of DataResponses IDs
 * @returns {string} The id of the created batch
 */
const createBatch = async (payload) => {
  const id = uuid();
  const batch = { ...payload, status: 'created' };
  await batches.store(id, batch);
  return id;
};

/**
 * @async
 * @function accumulate Pushes a dataResponseId into an accumulator store
 * @param {number} accumulatorId
 * @param {string} dataResponseId
 * @returns {string[]} Updated list of DataResponses IDs
 */
const accumulate = async (accumulatorId, dataResponseId) => {
  const dataResponseIds = await accumulator.safeFetch(accumulatorId, []);
  const newDataResponseIds = Array
    .from(new Set([...dataResponseIds, dataResponseId]))
    .filter(id => id);
  await accumulator.store(accumulatorId, newDataResponseIds);
  return newDataResponseIds;
};


/**
 * @async
 * @function clear Clears the accumulator store
 * @param {number} accumulatorId
 */
const clear = async accumulatorId => accumulator.store(accumulatorId, []);

const queue = createQueue('DataResponseQueue');

export const addProcessDataResponseJob = params => queue.add('process', { ...params, ...config.dataResponseQueue });
export const addSendNotarizationBatchJob = params => queue.add('send', params);

/**
 * @typedef ProcessDataResponseJobData
 * @property {number} orderId DataOrder's id in the DataExchange
 * @property {number} price DataOrder's price
 * @property {string} dataResponseId Offchain DataResponse's id
 * @property {number} maximumBatchSize Configured batch maximum size
 *
 * @async
 * @function processDataResponseJob
      Accumulates DataResponses until a maximum batch size is met. When this
      happens another Job is enqueued to prepare the notarization request.
 * @param {number} job.id
 * @param {ProcessDataResponseJobData} job.data
 * @returns {import('../utils/stores').DataResponse} The updated DataResponse
 */
export const processDataResponseJob = async (job) => {
  const {
    id, data: {
      orderId, price, dataResponseId, batchSize,
    },
  } = job;

  const dataResponse = await dataResponses.fetch(dataResponseId);
  const { status, notaryAddress } = dataResponse;
  if (status !== 'queued') {
    logger.warn(`DR[${id}] :: Process :: Cant't process DataResponse (${status})`);
    return dataResponse;
  }

  const accumulatorId = `${orderId}:${notaryAddress}`;
  const dataResponseIds = await accumulate(accumulatorId, dataResponseId);
  if (batchSize === -1) {
    logger.info(`addPrepareNotarizationJob will not be called on batchSize: ${batchSize}`);
  } else if (dataResponseIds.length >= batchSize) {
    addSendNotarizationBatchJob({
      accumulatorId,
      orderId,
      price,
      notaryAddress,
    });
  }

  const updateDataReseponse = { ...dataResponse, status: 'batched' };
  await dataResponses.store(dataResponseId, updateDataReseponse);

  await dataResponsesLastAdded.store(accumulatorId, { notaryAddress, orderId, price });

  return updateDataReseponse;
};

export const sendNotarizationBatchJob = async (job) => {
  const {
    data: {
      accumulatorId, orderId, price, notaryAddress,
    },
  } = job;

  const dataResponseIds = await accumulator.safeFetch(accumulatorId);

  await clear(accumulatorId);
  const batchId = await createBatch({ orderId, notaryAddress, dataResponseIds });
  await addPrepareNotarizationJob({ batchId, price });

  await dataResponsesLastAdded.del(accumulatorId);
};

queue.process('process', processDataResponseJob);
queue.process('send', sendNotarizationBatchJob);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`DR[${id}] :: Process :: ${failedReason} (will be retried)`);
});
