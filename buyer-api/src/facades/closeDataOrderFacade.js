import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { sendTransaction, retryAfterError, transactionResponse } from './helpers';
import { web3, DataOrderContract, logger } from '../utils';
import signingService from '../services/signingService';
import config from '../../config';

/**
 * @async
 * @param {String} orderAddress
 * @returns {Array} Error messages
 */
const validate = async (orderAddress) => {
  let errors = [];
  const dataOrder = DataOrderContract.at(orderAddress);
  const sellers = await getSellersInfo(web3, dataOrder);

  const isClosed = (await !dataOrder.transactionCompletedAt()).isZero();

  if (!sellers.every(({ status }) => status === 'TransactionCompleted')) {
    errors = ['Order has pending data responses'];
  }

  return { errors, isClosed };
};

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @returns {Response} The result of the operation.
 */
const closeDataOrderFacade = async (orderAddr, account, batchId, batchLength, addJob) => {
  const { errors, isClosed } = await validate(orderAddr);

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  if (isClosed) { return new Response({ status: 'success' }); }

  try {
    const receipt = await sendTransaction(
      web3,
      account,
      signingService.signCloseOrder,
      { orderAddr },
      config.contracts.gasPrice.fast,
    );

    const tx = await transactionResponse(web3, receipt);

    if (tx === null) {
      addJob('closeDataOrder', {
        orderAddr, account, batchId, batchLength, addJob,
      });
    } else {
      addJob('dataOrderClosed', {
        batchId, batchLength,
      });
    }
    return new Response({ status: 'pending' });
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error('Could not buy data (it will not be retried)' +
        ` | reason: ${error.message}` +
        ` | params ${JSON.stringify({ account, orderAddr })}`);
    } else {
      throw error;
    }
    return new Response(null, errors);
  }
};

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @param {String} batchId The ID for the batch.
 */
const onDataOrderClosed = async (
  batchId, batchLength, closedDataOrdersCache,
) => {
  try {
    const count = await closedDataOrdersCache.incr(batchId);
    if (Number(count) === batchLength) {
      return new Response({ status: 'done', batchId });
    }
    return new Response({ status: 'pending', batchId });
  } catch (err) {
    return new Response({ status: 'pending', batchId });
  }
};
export { closeDataOrderFacade, onDataOrderClosed };
