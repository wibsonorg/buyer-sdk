import { addTransactionJob } from '../queues/transactionQueue';
import { notarizations, dataOrders, currentPaymentsAmount } from '../utils/stores';
import { packPayData } from '../blockchain/batPay';
import { hasEnoughBatPayBalance } from '../blockchain/balance';
import { web3, logger } from '../utils';
import { fromWib } from '../utils/wibson-lib/coin';
import config from '../../config';

const { batPayId } = config;
const { toBN } = web3.utils;

/**
 * @param {import('../utils/stores').NotarizationResult} notarizationResult
 *    filtered results from notary
 * @param {Function} pauseQueue function that pauses the queue in which
 *    registerPayment is running
 *    notarizationRequestId of each pending or ongoing payment
 */
export const registerPayment = async (notarizationRequestId, pauseQueue) => {
  logger.info(`registerPayment :: Notarization Request ID ${notarizationRequestId}`);
  /**
   * 4.4 The registerPayment operation will receive the NotarizationResult,
   * it will build the data payload containing:
   *
   * fromId: Buyer’s account id in the BatchPayments contract
   * amount: DataOrder’s price
   * payData: Includes the sellers’ ids
   * lock: extracted from the NotarizationResult
   * metadata: hash of the dataExchange address concatenated with
   *           the orderId involved in the transaction
   *
   * The rest of the parameters of the transfer signature are empty
   *
   * The operation sends the transaction to the Buyer SS and wait for it to respond.
   * Once the signature is responded,
   * the operation will add new job to the transaction queue to send the transaction to the network.
   * if account's balance in BatPay is less than the amount to pay, register payments queue will be
   * paused
   */

  const pendingPaymentsAmount = toBN(await currentPaymentsAmount.safeFetch('current_amount', 0));

  // data payload
  const {
    result: {
      notarizationFee: fee, orderId, sellers, lockingKeyHash,
    },
  } = await notarizations.fetch(notarizationRequestId);

  const { transactionHash, price } = await dataOrders.fetchByDxId(orderId);
  const amount = toBN(fromWib(price)).muln(sellers.length);
  if (!(await hasEnoughBatPayBalance(batPayId, amount.add(pendingPaymentsAmount)))) {
    await pauseQueue("account's balance in BatPay is less than amount.");
    return false;
  }

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

  await currentPaymentsAmount.update('current_amount', currentAmount => toBN(currentAmount).add(amount).toString(), 0);

  return payload;
};
