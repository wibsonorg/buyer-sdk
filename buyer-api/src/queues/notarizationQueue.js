import uuid from 'uuid/v4';
import { createQueue } from './createQueue';
import {
  dataResponses,
  dataResponsesBatches as batches,
  notarizations,
} from '../utils/stores';
import logger from '../utils/logger';

/**
 * @async
 * @function createNotarizationRequest
 *  Creates a Notarization record containing the NotarizationRequest.
 * @param {string} notaryAddress Notary's Ethereum address
 * @param {number} orderId Order ID in the DataExchange contract
 * @param {import('../utils/stores').NotarizationSeller[]} sellers List of sellers data
 * @returns {string} ID of the Notarization record
 */
const createNotarizationRequest = (notaryAddress, orderId, sellers) => {
  const id = uuid();
  const callbackUrl = `{baseUrl}/notarization-result/${id}`;
  const request = { orderId, sellers, callbackUrl, status: 'created' };
  notarizations.store(id, { notaryAddress, request });
  return id;
}

/**
 * @async
 * @function collectNotarizationSellers
 *  Fetches every DataResponse to extract the fields required for notarization.
 * @param {string[]} dataResponseIds List of DataResponses IDs
 * @returns {import('../utils/stores').NotarizationSeller[]} List of sellers data
 */
const collectNotarizationSellers = async (dataResponseIds) =>
  dataResponseIds.reduce(async (accumulatorPromise, dataResponseId) => {
    const accumulator = await accumulatorPromise;
    const {
      sellerAddress,
      sellerId,
      decryptionKeyHash,
    } = await dataResponses.fetch(dataResponseId);
    return [...accumulator, { sellerAddress, sellerId, decryptionKeyHash }];
  }, Promise.resolve([]));

const queue = createQueue('NotarizationQueue');

/**
 * @async
 * @function prepare
 *  Builds the NotarizationRequest object from the DataResponse Batch and
 *  enqueues another job to send the request to the notary.
 * @param {number} job.id
 * @param {string} job.data.batchId Batch ID from where the Notarization is built.
 * @returns {string} The Notarization ID
 */
export const prepare = async ({ id, data: { batchId } }) => {
  const {
    orderId,
    notaryAddress,
    dataResponseIds,
    status,
    ...rest
  } = await batches.fetch(batchId);

  if (status !== 'created') {
    logger.warn(`N[${id}] :: Prepare :: Can't prepare notarization (${status})`);
    return;
  }

  const sellers = await collectNotarizationSellers(dataResponseIds);
  const notarizationRequestId = await createNotarizationRequest(
    notaryAddress,
    orderId,
    sellers,
  );
  await addRequestNotarizationJob({ notarizationRequestId });
  await batches.store(batchId, {
    orderId,
    notaryAddress,
    dataResponseIds,
    status: 'processed',
    ...rest
  });

  return notarizationRequestId;
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
