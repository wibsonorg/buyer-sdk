import { addTransactionJob } from '../queues/transactionQueue';
import { notarizations, dataOrders } from '../utils/stores';
import { packPayData } from '../blockchain/batPay';
import logger from '../utils/logger';
import { fromWib } from '../utils/wibson-lib/coin';
import config from '../../config';

const { batPayId } = config;

/**
 * @param {import('../utils/stores').NotarizationResult} notarizationResult
 *    filtered results from notary
 */
export const registerPayment = async (notarizationRequestId) => {
  logger.info(`registerPayment :: Notarization Request ID ${notarizationRequestId}`);
  /**
   * 4.4 The registerPayment operation will receive the NotarizationResult,
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
      notarizationFee: fee, orderId, sellers, lockingKeyHash,
    },
  } = await notarizations.fetch(notarizationRequestId);
  const { transactionHash, price } = await dataOrders.fetchByDxId(orderId);

  const payload = {
    fromId: batPayId,
    amount: fromWib(price),
    payData: packPayData(sellers.map(({ id }) => id)),
    lockingKeyHash,
    metadata: transactionHash,
    fee,
    newCount: '0x0000000000000000000000000000000000000000000000000000000000000000',
    rootHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  };

  await addTransactionJob('RegisterPayment', payload);

  return payload;
};
