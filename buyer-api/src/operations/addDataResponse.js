import { fetchDataResponse, storeDataResponse } from '../utils/stores';
import { addProcessDataResponseJob } from '../queues/dataResponseQueue';

const safeFetchDataResponse = async (id) => {
  try {
    return await fetchDataResponse(id);
  } catch (error) {
    return null;
  }
}

/**
 * @async
 * @function addDataResponse
 * @param {Object} dataOrder DataOrder object
 * @param {Number} dataResponse.orderId Order ID in the DataExchange contract
 * @param {String} dataResponse.sellerAddress Seller's Ethereum address
 * @param {Number} dataResponse.sellerId Seller's ID in the BatPay contract
 * @param {String} dataResponse.encryptedData Data encrypted with symmetric-key algorithm
 * @param {String} dataResponse.decryptedDataHash Hash of the raw data
 * @param {String} dataResponse.decryptionKeyHash Hash of the key used to encrypt the data
 * @param {String} dataResponse.notaryAddress Notary's Ethereum address
 * @param {String} dataResponse.notaryUrl Notary's service url
 * @param {Boolean} dataResponse.needsRegistration Whether the Seller needs to be registered in BatPay or not
 * @returns {Object} Object with either the id and status of the DataResponse
 *                   or the error if any.
 */
export const addDataResponse = async (dataOrder, dataResponse) => {
  if (dataOrder.status === 'closed') {
    return { error: 'Can\'t add DataResponse to a closed DataOrder' };
  }

  const { orderId, sellerAddress, sellerId } = dataResponse;
  const id = `${orderId}:${sellerAddress}`;

  const existingDataResponse = await safeFetchDataResponse(id);
  if (existingDataResponse) {
    return { id, status: existingDataResponse.status };
  }

  const shouldProcess = sellerId > 0;
  const status = shouldProcess ? 'queued' : 'waiting';
  // (2019-01-28) Buyer Registration case is skipped at the moment.

  await storeDataResponse(id, { ...dataResponse, status });
  if (shouldProcess) await addProcessDataResponseJob(id);

  return { id, status };
};
