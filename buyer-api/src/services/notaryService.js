import client from 'request-promise-native';

import logger from '../utils/logger';
import config from '../../config';
import { dataOrders, notarizations } from '../utils/stores';
import { addTransactionJob } from '../queues/transactionQueue';
import { getPayData } from '../utils/blockchain';

/**
 * We are not going to wait the service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 10000;

export const notarize = async (url, id, payload) =>
  client.post(`${url}/${id}`, { json: payload, timeout });

/**
 * TODO: Move this function elsewhere since the purpose of the service modules
 * is to build and send http (or other protocol) requests to external services.
 *
 * @typedef {import('../operations/receiveNotarizationResult').NotarizationResult}
 *          NotarizationResult
 * @param {NotarizationResult} notarizationResult filtered results from notary
 */
export const transferNotarizacionResult = async (notarizationRequestId) => {
  logger.info('transferNotarizacionResult');
  /**
   * 4.4 The transfer operation will receive the NotarizationResult,
   * it will build the data payload containing:
   *
   * fromId: Buyer’s account id in the BatchPayments contract
   * amount: DataOrder’s price
   * payData: Includes the sellers’ ids
   * lock: extracted from the NotarizationResult
   * metadata: hash of the dataEchange address concatenated with
   *           the orderId involved in the transaction
   *
   * The rest of the parameters of the transfer signature are empty
   *
   * The operation sends the transaction to the Buyer SS and wait for it to respond.
   * Once the signature is responded,
   * the operation will add new job to the transaction queue to send the transaction to the network.
   */
  // data payload
  const {
    result: {
      orderId,
      sellers,
      lock,
    },
  } = notarizations.fetch(notarizationRequestId);
  const { dataExchange: dx } = config.contracts.addresses;

  // search for data order
  const { price } = await dataOrders.fetch(orderId);

  const payload = {
    amount: price,
    payData: getPayData(sellers.map(s => s.id)),
    lock,
    metadata: `${dx}${orderId}`,
  };

  await addTransactionJob('Transfer', payload);

  return payload;
};
