import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { enqueueTransaction, priority } from '../queues';
import { web3, dataOrderAt } from '../utils';
import config from '../../config';

/**
 * @async
 * @param {String} orderAddress
 * @returns {Array} Error messages
 */
const validate = async (orderAddress) => {
  let errors = [];
  const dataOrder = dataOrderAt(orderAddress);
  const sellers = await getSellersInfo(web3, dataOrder);

  if (!sellers.every(({ status }) => status === 'TransactionCompleted')) {
    errors = ['Order has pending data responses'];
  }

  return errors;
};

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @returns {Response} The result of the operation.
 */
const closeDataOrderFacade = async (orderAddr, account, batchId, batchLength, addJob) => {
  const errors = await validate(orderAddr);

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  enqueueTransaction(
    account,
    'CloseOrder',
    { orderAddr },
    config.contracts.gasPrice.fast,
    { priority: priority.LOW },
  );

  addJob('dataOrderClosed', {
    batchId, batchLength,
  });

  return new Response({ status: 'pending' });
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
