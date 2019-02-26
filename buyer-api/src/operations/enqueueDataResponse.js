import { dataResponses } from '../utils/stores';
import { addProcessDataResponseJob } from '../queues/dataResponseQueue';

/**
 * @function enqueueDataResponse
 * Updates DataResponse and launch addProcessDataResponseJob.
 * @param {Number} orderId Order ID in the DataExchange contract
 * @param {string} sellerAddress Seller's ethereum address.
 * @param {number} sellerId Seller's unique ID.
 */
export const enqueueDataResponse = async (orderId, sellerAddress, sellerId) => {
  const id = `${orderId}:${sellerAddress}`;

  const existingDataResponse = await dataResponses.safeFetch(id);
  if (existingDataResponse && existingDataResponse.status !== 'waiting') {
    return { id, status: existingDataResponse.status };
  }
  if (!existingDataResponse) {
    return { error: 'There\'s not a DataResponse with the data provided' };
  }

  await dataResponses.update(id, { status: 'queued', sellerId });

  await addProcessDataResponseJob({ orderId, dataResponseId: id, type: 'processDataResponse' });
  return { id, status: 'queued' };
};
