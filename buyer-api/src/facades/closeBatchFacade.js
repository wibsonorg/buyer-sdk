import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { getDataOrder } from './getOrdersFacade';
import { getBatchInfo } from '../services/batchInfo';
import { sendTransaction } from './helpers';
import { web3, DataOrderContract } from '../utils';
import signingService from '../services/signingService';
import config from '../../config';

const batchTTL = Number(config.contracts.cache.ordersTTL);

const addClosedOrderToCache = (closedOrder, closedDataOrdersCache) =>
  closedDataOrdersCache.set(batchId, JSON.stringify(batch), 'EX', batchesTTL);

  const cachedBatch = await batchesCache.get(batchId);

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
const closeBatch = async (batchId, ordersCache, closedDataOrdersCache, queue) => {
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
      queue.add('closeDataOrder', {
        orderAddr: order.orderAddress,
        account,
        batchId,
        batchLength: ordersOfBatch.length
      }, {
        attempts: 20,
        backoff: {
          type: 'linear',
        },
      });
    }
    return undefined;
  });

  return new Response({ status: 'pending', receipts });
};

// TODO: onDataOrderClosed to check if all orders of batch were closed
// /**
//  * @async
//  * @param {String} receipt Transaction hash.
//  * @param {Array} notaries Ethereum addresses of the notaries involved.
//  * @param {String} buyerInfoId The ID for the buyer info.
//  * @param {Object} dataOrderQueue DataOrder's queue object.
//  */
// const onDataOrderSent = async (
//   receipt,
//   account,
//   notaries,
//   buyerInfoId,
//   batchId,
//   addJob,
// ) => {
//   const { logs } = await getTransactionReceipt(web3, receipt);
//   const { orderAddr } = extractEventArguments(
//     'NewOrder',
//     logs,
//     dataExchange,
//   );
//
//   addJob('addNotariesToOrder', { orderAddr, account, notaries });
//   addJob('associateBuyerInfoToOrder', { orderAddr, buyerInfoId });
//   addJob('associateOrderToBatch', { batchId, orderAddr });
// };

export { closeBatch };
