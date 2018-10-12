import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { getDataOrder } from './getOrdersFacade';
import { getBatchInfo } from '../services/batchInfo';
import { sendTransaction } from './helpers';
import { web3, DataOrderContract } from '../utils';
import signingService from '../services/signingService';
import config from '../../config';

/**
 * @async
 * @param {String} orderAddresses that will be closed
 * @returns {Array} Error messages
 */
const validate = async (orderAddresses) => {
  let errors = [];

  orderAddresses.forEach(async (orderAddress) => {
    const dataOrder = DataOrderContract.at(orderAddress);
    const sellers = await getSellersInfo(web3, dataOrder);
    if (!sellers.every(({ status }) => status === 'TransactionCompleted')) {
      errors = ['Order has pending data responses'];
    }
  });

  return errors;
};

/**
 * @async
 * @param {String} batchId Batch that has the orders to be closed.
 * @param {Object} ordersCache to retrieve orders info
 * @returns {Response} The result of the operation.
 */
const closeBatch = async (batchId, ordersCache) => {
  const ordersOfBatch = await getBatchInfo(batchId);
  const errors = await validate(ordersOfBatch);

  const { children } = await signingService.getAccounts();

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const dataOrders =
  await Promise.all(ordersOfBatch.map(order => getDataOrder(order, ordersCache)));

  const receipts = dataOrders.map((order) => {
    const account = children.filter(child => child.address === order.buyerAddress);
    if (account.length > 0) {
      return sendTransaction(
        web3,
        account[0],
        signingService.signCloseOrder,
        { order },
        config.contracts.gasPrice.fast,
      );
    }
    return undefined;
  });

  return new Response({ status: 'pending', receipts });
};

export { closeBatch };
