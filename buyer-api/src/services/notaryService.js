import client from 'request-promise-native';
import { logger } from '../utils';
import signinService from './signingService';

/**
 * We are not going to wait the service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 10000;

const consent = async (url, { buyerAddress, orderAddress }) => {
  const result = await client.get(
    `${url}/buyers/audit/consent/${buyerAddress}/${orderAddress}`,
    {
      timeout,
    },
  );

  const {
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    signature,
  } = JSON.parse(result);

  return {
    orderAddr: orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    notarySignature: signature,
  };
};

/**
 * @typedef {import('../operations/notarizationResultReception').NotarizationResult}
 *          NotarizationResult
 * @param {NotarizationResult} notarizationResult filtered results from notary
 */
const transferNotarizacionResult = async (notarizationResult) => {
  logger.info('transferNotarizacionResult');
  /**
   * 4.4 The transfer operation will receive the NotarizationResult,
   * it will build the data payload containing:
   *
   * fromId: Buyer’s account id in the BatchPayments contract
   * amount: DataOrder’s price
   * payData: Includes the sellers’ ids, notary id and its notarizationFee,
   *          and also the unlocker id along with its unlockingFee.
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

  // buyer's account id in the BatchPayments contracts
  const { id: buyerId } = await signinService.getAccount();
  // search for data order
  // const { dataOrder } = dataOrders.fetch(notarizationResult.orderId);
  // const amount = 10000; // DataOrder's price
  // const { payData } = notarizationResult;

  // console.log('buyerId', buyerId);
  const payload = {
    fromId: buyerId,
    amount: 'dataOrder.price',
    payData: 'Includes the sellers’ ids, notary id and its notarizationFee...',
    lock: notarizationResult.lock,
    metadata: 'hash of the dataEchange ...',
  };

  return payload;
};

export { consent, transferNotarizacionResult };
