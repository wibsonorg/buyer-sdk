import client from 'request-promise-native';
import { addTransactionJob } from '../queues/transactionQueue';
import { notarizations, dataOrders } from '../utils/stores';
import { packPayData } from '../blockchain/batPay';
import logger from '../utils/logger';
import { fromWib } from '../utils/wibson-lib/coin';

/**
 * We are not going to wait the service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 10000;

export const notarize = async (url, id, payload) =>
  client.post(url, { json: payload, timeout });

/**
 * TODO: Move this function elsewhere since the purpose of the service modules
 * is to build and send http (or other protocol) requests to external services.
 * @param {import('../utils/stores').NotarizationResult} notarizationResult
 *    filtered results from notary
 */
export const transferNotarizationResult = async (notarizationRequestId) => {
  logger.info(`transferNotarizacionResult :: ${notarizationRequestId}`);
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
      notarizationFee: fee,
      orderId,
      sellers,
      lock,
    },
  } = await notarizations.fetch(notarizationRequestId);
  const { transactionHash, price } = await dataOrders.fetchByDxId(orderId);

  const payload = {
    amount: fromWib(price),
    payData: packPayData(sellers.map(({ sellerId }) => sellerId)),
    lock,
    metadata: transactionHash,
    fee,
    newCount: '0x',
    rootHash: '0x',
  };

  await addTransactionJob('Transfer', payload);

  return payload;
};
