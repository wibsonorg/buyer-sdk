import config from '../../config';
import { logger, dataExchange, DataOrderContract } from '../utils';
import { getElements } from './helpers/blockchain';
import { dateOrNull } from './helpers/date';
import { storage as offchainStorage, coin } from '../utils/wibson-lib';

const ordersTTL = Number(config.contracts.cache.ordersTTL);
const { toWib } = coin;

/**
 * @async
 * @function addOrderToCache
 * @param {Object} dataOrder the data order to store in the cache
 * @param {Object} ordersCache Redis storage used for orders caching
 * @returns {Promise} Promise which resolves to redis result
 */
const addOrderToCache = (dataOrder, ordersCache) =>
  ordersCache.set(dataOrder.orderAddress, JSON.stringify(dataOrder), 'EX', ordersTTL);

/**
 * @async
 * @function addOffChainInfo
 * @param {Object} dataOrder the already-fetched data order
 * @returns {Promise} Promise which resolves to the offchain data
 */
const addOffChainInfo = async dataOrder => ({
  ...dataOrder,
  offChain: {
    dataResponsesCount: await offchainStorage.countDataResponses(dataOrder),
    dataCount: await offchainStorage.countData(dataOrder),
  },
});

/**
 * @async
 * @function getDataOrderDetails
 * @param {Object} order the instance of the DataOrder truffle contract
 * @param {Object} web3 the web3 object.
 * @throws When can not connect to blockchain or data is corrupt.
 * @returns {Promise} Promise which resolves to the data order object.
 */
const getDataOrderDetails = async (order) => {
  const [
    filters,
    dataRequest,
    notaries,
    sellers,
    termsAndConditions,
    buyerPublicURL,
    buyerPublicKey,
    dataOrderCreatedAt,
    transactionCompletedAt,
    price,
  ] = await Promise.all([
    order.filters(),
    order.dataRequest(),
    getElements(order, 'notaries'),
    getElements(order, 'sellers'),
    order.termsAndConditions(),
    order.buyerURL(),
    order.buyerPublicKey(),
    order.createdAt(),
    order.transactionCompletedAt(),
    order.price(),
  ]);

  return {
    orderAddress: order.address,
    audience: JSON.parse(filters),
    requestedData: JSON.parse(dataRequest),
    notaries,
    responseBought: sellers.length,
    termsAndConditions,
    buyerPublicURL: JSON.parse(buyerPublicURL),
    buyerPublicKey,
    price: toWib(price),
    createdAt: dateOrNull(dataOrderCreatedAt),
    transactionCompletedAt: dateOrNull(transactionCompletedAt),
    isClosed: !transactionCompletedAt.isZero(),
  };
};

/**
 * @async
 * @function fetchAndCacheDataOrder
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {Object} ordersCache store used for Order caching
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const fetchAndCacheDataOrder = async (orderAddress, ordersCache) => {
  const order = DataOrderContract.at(orderAddress);
  const dataOrder = await getDataOrderDetails(order);
  const fullDataOrder = await addOffChainInfo(dataOrder);
  await addOrderToCache(fullDataOrder, ordersCache);
  return fullDataOrder;
};

/**
 * @async
 * @function getDataOrder
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {Object} ordersCache Redis storage used for orders caching
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const getDataOrder = async (orderAddress, ordersCache) => {
  const cachedDataOrder = await ordersCache.get(orderAddress);
  if (cachedDataOrder) {
    logger.debug('DataOrder :: Cache Hit ::', { orderAddress });
    return JSON.parse(cachedDataOrder);
  }

  logger.debug('DataOrder :: Cache Miss :: Fetching from blockchain... ::', { orderAddress });
  return fetchAndCacheDataOrder(orderAddress, ordersCache);
};

/**
 * @async
 * @function getOrdersForBuyer
 * @param {Object} buyerAddress the buyer's Ethereum address.
 * @param {Object} ordersCache Redis storage used for orders caching
 * @param {Number} offset Pagination offset
 * @param {Number} limit DataOrders per page in pagination
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list of orders.
 */
const getOrdersForBuyer = async (
  buyerAddress,
  ordersCache,
  offset = 0,
  limit = undefined,
) => {
  const orderAddresses = await dataExchange.getOrdersForBuyer(buyerAddress);
  const upperBound = limit && offset > 0 ? offset + limit : orderAddresses.length;
  const ordersPage = orderAddresses.slice(offset, upperBound);

  const dataOrders = ordersPage.map(orderAddress =>
    getDataOrder(orderAddress, ordersCache));

  return Promise.all(dataOrders);
};

export { getDataOrder, getOrdersForBuyer, fetchAndCacheDataOrder };
