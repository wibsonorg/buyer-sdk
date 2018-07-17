import config from '../../config';
import { logger, createRedisStore } from '../utils';
import { getElements } from './helpers/blockchain';
import { dateOrNull } from './helpers/date';

const ordersCache = createRedisStore('orders.cache.');
const ordersTTL = Number(config.contracts.cache.ordersTTL);

/**
 * @async
 * @function addOrderToCache
 * @param {Object} dataOrder the data order to store in the cache
 * @returns {Promise} Promise which resolves to redis result
 */
const addOrderToCache = dataOrder =>
  ordersCache.set(dataOrder.orderAddress, JSON.stringify(dataOrder), 'EX', ordersTTL);

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
    termsAndConditions,
    buyerPublicURL: JSON.parse(buyerPublicURL),
    buyerPublicKey,
    price,
    createdAt: dateOrNull(dataOrderCreatedAt),
    transactionCompletedAt: dateOrNull(transactionCompletedAt),
    isClosed: !transactionCompletedAt.isZero(),
  };
};

/**
 * @async
 * @function getDataOrder
 * @param {Object} DataOrderContract the Data Order truffle contract.
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {Object} buyerInfoPerOrder Level Storage with orderAddress: buyerInfoId
 * @param {Object} buyerInfos Level Storage with buyerInfoId: info
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const getDataOrder = async (DataOrderContract, orderAddress) => {
  let dataOrder = await ordersCache.get(orderAddress);

  if (!dataOrder) {
    logger.debug('DataOrder :: Cache Miss :: Fetching from blockchain... ::', { orderAddress });
    const order = await DataOrderContract.at(orderAddress);

    dataOrder = await getDataOrderDetails(order);
    await addOrderToCache(dataOrder);
  } else {
    logger.debug('DataOrder :: Cache Hit ::', { orderAddress });
    dataOrder = JSON.parse(dataOrder);
  }

  return dataOrder;
};

/**
 * @async
 * @function getOrdersForBuyer
 * @param {Object} dataExchange the Data Exchange truffle contract instance.
 * @param {Object} DataOrderContract the Data Order truffle contract.
 * @param {Object} buyerAddress the buyer's Ethereum address.
 * @param {Object} buyerInfoPerOrder Level Storage with orderAddress: buyerInfoId
 * @param {Object} buyerInfos Level Storage with buyerInfoId: info
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list of orders.
 */
const getOrdersForBuyer = async (
  dataExchange,
  DataOrderContract,
  buyerAddress,
  buyerInfoPerOrder,
  buyerInfos,
  offset = 0,
  limit = undefined,
) => {
  const orderAddresses = await dataExchange.getOrdersForBuyer(buyerAddress);
  const upperBound = limit ? offset + limit : orderAddresses.length;
  const ordersPage = orderAddresses.slice(offset, upperBound);

  const dataOrders = ordersPage.map(orderAddress => getDataOrder(DataOrderContract, orderAddress));

  return Promise.all(dataOrders);
};

export { getDataOrder, getOrdersForBuyer };
