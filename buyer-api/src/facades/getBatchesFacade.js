import config from '../../config';
import { getDataOrder } from './getOrdersFacade';
import { listBatchPairs } from '../services/batchInfo';
import { logger } from '../utils';

// Using same as orders to avoid inconsistenciess
const batchesTTL = Number(config.contracts.cache.ordersTTL);

/**
 * @async
 * @function addBatchToCache
 * @param {Object} batchId the data order to store in the cache
 * @param {Object} batchCache Redis storage used for orders caching
 * @returns {Promise} Promise which resolves to redis result
 */
const addBatchToCache = (batch, batchesCache) =>
  batchesCache.set(batch.batchId, JSON.stringify(batch), 'EX', batchesTTL);

/**
 * @async
 * @function fetchAndCacheDataOrder
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {Object} ordersCache store used for Order caching
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const fetchAndCacheBatch = async (batchId, orderAddresses, ordersCache, batchesCache) => {
  const firstOrder = await getDataOrder(orderAddresses[0], ordersCache);
  // Removing orderAddress since they are grouped in orderAddresses
  const { orderAddress: deletedKey, ...orderProperties } = firstOrder;

  await addBatchToCache({ batchId, ...orderProperties, orderAddresses }, batchesCache);
  return { batchId, ...orderProperties, orderAddresses };
};

/**
 * @async
 * @function getBatchInfo
 * @param {String} batchId a timestamp
 * @param {String} orderAddresses the ethereum addresses for the Data Orders
 * @param {Object} ordersCache Redis storage used for orders caching
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const getBatchInfo = async (batchId, orderAddresses, ordersCache, batchesCache) => {
  const cachedBatch = await batchesCache.get(batchId);
  if (cachedBatch) {
    logger.debug('Batch :: Cache Hit ::', { batchId });
    return JSON.parse(cachedBatch);
  }
  logger.debug('Batch :: Cache Miss :: Fetching from Level... ::', { batchId });
  return fetchAndCacheBatch(batchId, orderAddresses, ordersCache, batchesCache);
};

/**
 * @async
 * @function getBatches
 * @param {Object} buyerAddress the buyer's Ethereum address.
 * @param {Object} ordersCache Redis storage used for orders caching
 * @param {Number} offset Pagination offset
 * @param {Number} limit DataOrders per page in pagination
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list of orders.
 */
const getBatches = async (
  ordersCache,
  batchesCache,
) => {
  const batchesRaw = await listBatchPairs();

  const batches = await Promise.all(batchesRaw.map(batch =>
    getBatchInfo(batch.key, JSON.parse(batch.value), ordersCache, batchesCache)));

  return batches;
};

export { getBatches, getBatchInfo };
