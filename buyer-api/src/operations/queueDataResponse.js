import { dataResponses } from '../utils/stores';
import { addProcessDataResponseJob } from '../queues/dataResponseQueue';

/**
 * @function queueDataResponse
 * Updates DataResponse and launch addProcessDataResponseJob.
 * @param {Number} orderId Order ID in the DataExchange contract
 * @param {string} sellerAddress Seller's ethereum address.
 * @param {number} sellerId Seller's unique ID.
 */
export const queueDataResponse = async (orderId, sellerAddress, sellerId) => {
  const id = `${orderId}:${sellerAddress}`;

  const existingDataResponse = await dataResponses.safeFetch(id);
  if (existingDataResponse && existingDataResponse.status !== 'waiting') {
    return { id, status: existingDataResponse.status };
  }
  if (!existingDataResponse) {
    return { error: 'There\'s not a DataResponse whith the data provided' };
  }

  await dataResponses.update(id, { status: 'queued', sellerId });

  await addProcessDataResponseJob({ orderId, dataResponseId: id });
  return { id, status: 'queued' };
};
