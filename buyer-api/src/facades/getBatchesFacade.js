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
   * @function getBatchesTotal
   * @param {Object} batchId the data order to store in the cache
   * @param {Object} batchCache Redis storage used for orders caching
   * @returns {Promise} Promise which resolves to redis result
   */
const getBatchesTotal = async () => {
  const batchesRaw = await listBatchPairs();
  const batchesInfo = batchesRaw.map(b => JSON.parse(b.value));
  const openBatches = batchesInfo.filter(b => b.status === 'open').length;
  const closedBatches = batchesInfo.filter(b => b.status !== 'open').length;
  return { openBatches, closedBatches };
};

/**
   * @async
   * @function consolidateResponses
   * @param {Array} orderAddresses address from where we will sum up all responses
   * @param {Object} ordersCache Redis storage used for orders caching
   * @returns {Promise} Promise which resolves to consolidated responses
   */
const consolidateResponses = async (orderAddresses, ordersCache) => {
  const dataOrders =
    await Promise.all(orderAddresses.map(order => getDataOrder(order, ordersCache)));

  const dataCount = dataOrders
    .map(order => order.offChain.dataCount)
    .reduce((accum, dataOrderCount) => accum + Number(dataOrderCount));
  const dataResponsesCount = dataOrders
    .map(order => order.offChain.dataResponsesCount)
    .reduce((accum, dataOrderCount) => accum + Number(dataOrderCount));
  const responsesBought = dataOrders
    .map(order => order.responsesBought)
    .reduce((accum, responses) => accum + Number(responses));

  return { offChain: { dataCount, dataResponsesCount }, responsesBought };
};

/**
 * @async
 * @function fetchAndCacheBatch
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {Object} ordersCache store used for Order caching
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const fetchAndCacheBatch = async (batchId, batchInfo, ordersCache, batchesCache) => {
  const { status, orderAddresses } = batchInfo;
  const firstOrder = await getDataOrder(orderAddresses[0], ordersCache);
  // Removing orderAddress since they are grouped in orderAddresses
  // Removing isClosed since the batch has its own status
  const { orderAddress: deletedKey, isClosed: deletedKey2, ...orderProperties } = firstOrder;
  const { offChain, responsesBought } = await consolidateResponses(orderAddresses, ordersCache);

  const newBatch = {
    batchId, ...orderProperties, isClosed: (status !== 'open'), offChain, responsesBought, ...batchInfo,
  };

  await addBatchToCache(newBatch, batchesCache);
  return newBatch;
};

/**
 * @async
 * @function getBatchInfo
 * @param {String} batchId a timestamp
 * @param {Object} batchInfo contains associated orders and batch status
 * @param {Object} ordersCache Redis storage used for orders caching
 * @param {Object} batchesCache Redis storage used for batches caching
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const getBatchInfo = async (batchId, batchInfo, ordersCache, batchesCache) => {
  const cachedBatch = await batchesCache.get(batchId);
  if (cachedBatch) {
    logger.debug('Batch :: Cache Hit ::', { batchId });
    return JSON.parse(cachedBatch);
  }
  logger.debug('Batch :: Cache Miss :: Fetching from Level... ::', { batchId });
  return fetchAndCacheBatch(batchId, batchInfo, ordersCache, batchesCache);
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
  offset,
  limit,
) => {
  const batchesRaw = await listBatchPairs();

  const upperBound = limit && offset >= 0 ? offset + limit : batchesRaw.length;
  const batchesPage = batchesRaw.slice(offset, upperBound);

  const batches = await Promise.all(batchesPage.map(batch =>
    getBatchInfo(batch.key, JSON.parse(batch.value), ordersCache, batchesCache)));

  return batches;
};

export { getBatches, getBatchInfo, getBatchesTotal, fetchAndCacheBatch };
