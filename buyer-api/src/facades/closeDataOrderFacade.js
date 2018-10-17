import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { sendTransaction } from './helpers';
import { web3, DataOrderContract } from '../utils';
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

  const receipt = await sendTransaction(
    web3,
    account,
    signingService.signCloseOrder,
    { orderAddr },
    config.contracts.gasPrice.fast,
  );

  addJob('dataOrderClosed', {
    batchId, batchLength,
  });

  return new Response({ status: 'pending', receipt });
};

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @param {String} batchId The ID for the batch.
 */
const onDataOrderClosed = async (
  batchId, batchLength, closedDataOrdersCache,
) => {
  closedDataOrdersCache.incr(batchId, (err, count) => {
    let response;
    if (err) {
      // TODO: Error
      response = new Response({ status: 'pending', batchId });
    } else if (Number(count) === batchLength) {
      response = new Response({ status: 'done', batchId });
    }
    return response;
  });
};
export { closeDataOrderFacade, onDataOrderClosed };
