import { dataResponses, sellers } from '../utils/stores';
import { putData } from '../utils/wibson-lib/s3';
import { addProcessDataResponseJob } from '../queues/dataResponseQueue';

/**
 * @async
 * @function addDataResponse
 * @param {Object} dataOrder DataOrder object
 * @param {Number} dataResponse.orderId Order ID in the DataExchange contract
 * @param {String} dataResponse.sellerAddress Seller's Ethereum address
 * @param {String} dataResponse.encryptedData Data encrypted with symmetric-key algorithm
 * @param {String} dataResponse.decryptedDataHash Hash of the raw data
 * @param {String} dataResponse.decryptionKeyHash Hash of the key used to encrypt the data
 * @param {String} dataResponse.notaryAddress Notary's Ethereum address
 * @param {Boolean} dataResponse.needsRegistration Whether the Seller needs to be
 *                                                 registered in BatPay or not
 * @returns {Object} Object with either the id and status of the DataResponse
 *                   or the error if any.
 */

const ERROR_CLOSED_DATA_RESPONSE = {
  message: "Can't accept DataReponse, closed data order",
  code: 'add_data_response.closed_data_order',
};

const ERROR_ADD_DATA_RESPONSE_INVALID_NOTARY = {
  message: "Can't accept DataReponse, invalid notary",
  code: 'add_data_response.invalid_notary',
};

export const addDataResponse = async (dataOrder, dataResponse) => {
  const { status: st, notariesAddresses } = dataOrder;
  if (st === 'creating' || st === 'closed') {
    return { error: ERROR_CLOSED_DATA_RESPONSE };
  }

  const {
    orderId, sellerAddress, encryptedData, notaryAddress, ...rest
  } = dataResponse;

  const sellerId = await sellers.safeFetch(sellerAddress, 0);

  const id = `${orderId}:${sellerAddress}`;

  if (!notariesAddresses.includes(notaryAddress)) {
    return {
      error: ERROR_ADD_DATA_RESPONSE_INVALID_NOTARY,
    };
  }

  const existingDataResponse = await dataResponses.safeFetch(id);
  if (existingDataResponse) {
    return { id, status: existingDataResponse.status };
  }

  const shouldProcess = sellerId > 0;
  const status = shouldProcess ? 'queued' : 'waiting';
  // TODO: Buyer Registration case is skipped at the moment (2019-01-28).

  // TODO: This has a two major problems (2019-02-01):
  // * time consuming: sending the data to BAPI, and from BAPI to S3 could
  //   potentially increase the response time.
  // * it's weak: if communication with S3 fails for any reason, user will be
  //   forced to "try again later".
  const s3 = putData(dataOrder.id, sellerAddress, encryptedData);

  const db = dataResponses.store(id, {
    orderId,
    sellerAddress,
    sellerId,
    notaryAddress,
    status,
    ...rest,
  });

  await Promise.all([s3, db]);
  if (shouldProcess) {
    await addProcessDataResponseJob({
      orderId,
      dataResponseId: id,
      type: 'processDataResponse',
    });
  }
  return { id, status };
};
