import config from '../../config';
import { logger, dataExchange, dataOrderAt } from '../utils';
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
  ordersCache.set(
    dataOrder.orderAddress.toLowerCase(),
    JSON.stringify(dataOrder),
    'EX',
    ordersTTL,
  );

const fetchOrderFromCache = async (orderAddress, ordersCache) =>
  ordersCache.get(orderAddress.toLowerCase());

/**
 * @async
 * @function addOffChainInfo
 * @param {Object} dataOrder the already-fetched data order
 * @returns {Promise} Promise which resolves to the offchain data
 */
const addOffChainInfo = async dataOrder => ({
  ...dataOrder,
  offChain: {
    dataResponsesCount: await offchainStorage.countDataResponses(dataOrder.orderAddress),
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
    buyerAddress,
    buyerPublicURL,
    buyerPublicKey,
    dataOrderCreatedAt,
    transactionCompletedAt,
    price,
  ] = await Promise.all([
    order.methods.filters().call(),
    order.methods.dataRequest().call(),
    getElements(order, 'notaries'),
    getElements(order, 'sellers'),
    order.methods.termsAndConditions().call(),
    order.methods.buyer().call(),
    order.methods.buyerURL().call(),
    order.methods.buyerPublicKey().call(),
    order.methods.createdAt().call(),
    order.methods.transactionCompletedAt().call(),
    order.methods.price().call(),
  ]);

  return {
    orderAddress: order.options.address.toLowerCase(),
    audience: JSON.parse(filters),
    requestedData: JSON.parse(dataRequest),
    notaries: notaries.map(notary => notary.toLowerCase()),
    responsesBought: sellers.length,
    termsAndConditions,
    buyerAddress,
    buyerPublicURL: JSON.parse(buyerPublicURL),
    buyerPublicKey,
    price: toWib(price).toString(10),
    createdAt: dateOrNull(dataOrderCreatedAt),
    transactionCompletedAt: dateOrNull(transactionCompletedAt),
    isClosed: (dateOrNull(transactionCompletedAt) !== null),
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
  const order = dataOrderAt(orderAddress);
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
  const cachedDataOrder = await fetchOrderFromCache(orderAddress, ordersCache);
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
  const orderAddresses = await dataExchange.methods.getOrdersForBuyer(buyerAddress).call();
  const upperBound = limit && offset >= 0 ? offset + limit : orderAddresses.length;
  const ordersPage = orderAddresses.slice(offset, upperBound);

  const dataOrders = ordersPage.map(orderAddress =>
    getDataOrder(orderAddress, ordersCache));

  return Promise.all(dataOrders);
};

/**
 * @async
 * @function getOrdersAmountForBuyer
 * @param {Object} buyerAddress the buyer's Ethereum address.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list of orders.
 */
const getOrdersAmountForBuyer = async (buyerAddress) => {
  const [openOrderAddresses, buyersOrderAddresses] = await Promise.all([
    dataExchange.methods.getOpenOrders().call(),
    dataExchange.methods.getOrdersForBuyer(buyerAddress).call(),
  ]);

  const count = buyersOrderAddresses.reduce((ordersCount, orderAddress) => {
    const isOpen = openOrderAddresses.includes(orderAddress);
    return {
      open: ordersCount.open + (isOpen ? 1 : 0),
      closed: ordersCount.closed + (isOpen ? 0 : 1),
    };
  }, { closed: 0, open: 0 });

  return count;
};

/**
 * @async
 * @function refreshOrdersCache
 * @param {Object} buyerAddress the buyer's Ethereum address.
 * @param {Object} ordersCache Redis storage used for orders caching
 * @throws When can not connect to blockchain or cache is not set up correctly.
 */
const refreshOrdersCache = async (buyerAddress, ordersCache) => {
  const orderAddresses = await dataExchange.methods.getOrdersForBuyer(buyerAddress).call();
  orderAddresses
    .forEach(orderAddress => fetchAndCacheDataOrder(orderAddress, ordersCache));
};

export {
  getDataOrder,
  getOrdersForBuyer,
  getOrdersAmountForBuyer,
  fetchAndCacheDataOrder,
  refreshOrdersCache,
};
