import uuid from 'uuid/v4';
import { createQueue } from './createQueue';
import { notarize } from '../services/notaryService';
import {
  dataResponses,
  dataResponsesBatches as batches,
  notarizations,
  notaries,
} from '../utils/stores';
import logger from '../utils/logger';
import config from '../../config';

const { buyerPublicBaseUrl } = config;

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
  const callbackUrl = `${buyerPublicBaseUrl}/notarization-result/${id}`;
  const request = {
    orderId, sellers, callbackUrl,
  };
  notarizations.store(id, { notaryAddress, request, status: 'created' });
  return id;
};

/**
 * @async
 * @function collectNotarizationSellers
 *  Fetches every DataResponse to extract the fields required for notarization.
 * @param {string[]} dataResponseIds List of DataResponses IDs
 * @returns {import('../utils/stores').NotarizationSeller[]} List of sellers data
 */
const collectNotarizationSellers = async dataResponseIds =>
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

export const addPrepareNotarizationJob = params => queue.add('prepare', params);
export const addSendNotarizationJob = params => queue.add('send', params);

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
    return null;
  }

  const sellers = await collectNotarizationSellers(dataResponseIds);
  const notarizationRequestId = await createNotarizationRequest(
    notaryAddress,
    orderId,
    sellers,
  );
  await addSendNotarizationJob({ notarizationRequestId });
  await batches.store(batchId, {
    orderId,
    notaryAddress,
    dataResponseIds,
    status: 'processed',
    ...rest,
  });

  return notarizationRequestId;
};

/**
 * @async
 * @function send
 *  Sends the NotarizationRequest to the Notary API
 * @param {number} job.id
 * @param {string} job.data.notarizationRequestId ID of the NotarizationRequest
 */
export const send = async ({ data: { notarizationRequestId } }) => {
  const { notaryAddress, request } = await notarizations.fetch(notarizationRequestId);
  const notary = await notaries.fetch(notaryAddress);

  await notarize(notary.apiUrl, notarizationRequestId, request);
  await notarizations.update(
    notarizationRequestId,
    {
      status: 'requested',
      requestedAt: new Date(),
    },
  );
};

queue.process('prepare', prepare);
queue.process('send', send);
queue.on('failed', ({ id, name, failedReason }) => {
  logger.error(`N[${id}] :: ${name} :: Error thrown: ${failedReason} (will be retried)`);
});
