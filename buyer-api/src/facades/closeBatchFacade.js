import apicache from 'apicache';
import Response from './Response';
import { getSellersInfo, getDataOrder, fetchAndCacheBatch } from './';

import { getBatchInfo, closeBatch, startClosingOfBatch } from '../services/batchInfo';
import { web3, DataOrderContract } from '../utils';
import signingService from '../services/signingService';

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
const closeOrdersOfBatch = async (batchId, ordersCache, closedDataOrdersCache, queue) => {
  const { orderAddresses } = await getBatchInfo(batchId);
  const errors = await validate(orderAddresses);

  const { children } = await signingService.getAccounts();

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  await startClosingOfBatch(batchId);

  const dataOrders =
  await Promise.all(orderAddresses.map(order => getDataOrder(order, ordersCache)));

  const receipts = dataOrders.map((order) => {
    const account = children.find(child => child.address === order.buyerAddress);
    if (account) {
      queue.add('closeDataOrder', {
        orderAddr: order.orderAddress,
        account,
        batchId,
        batchLength: orderAddresses.length,
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

/**
 * @async
 * @param {String} receipt Transaction hash.
 * @param {Array} notaries Ethereum addresses of the notaries involved.
 * @param {String} buyerInfoId The ID for the buyer info.
 * @param {Object} dataOrderQueue DataOrder's queue object.
 */
const onBatchClosed = async (
  batchId,
  batchesCache,
  ordersCache,
) => {
  // Fetching and caching for ensuring latest version of batch
  const batchInfo = await getBatchInfo(batchId);
  await fetchAndCacheBatch(batchId, batchInfo, ordersCache, batchesCache);
  await closeBatch(batchId);
  apicache.clear('/batches/*');
};

export { closeOrdersOfBatch, onBatchClosed };
