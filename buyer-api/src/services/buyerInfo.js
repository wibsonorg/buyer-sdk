import { web3 } from '../utils';
import { buyerInfos, buyerInfoPerOrder } from '../utils/stores';

/**
 * @async
 * @function getBuyerInfo
 * @description Gets stored buyer info
 * @param {String} buyerInfoId the ethereum address for the Data Order
 * @throws When there is no data for that buyerInfoId.
 * @returns {Promise} Promise which resolves to a buyer info.
 */
const getBuyerInfo = async (buyerInfoId) => {
  const buyerInfo = await buyerInfos.get(buyerInfoId);
  return JSON.parse(buyerInfo);
};


/**
 * @async
 * @function getBuyerInfo
 * @returns {Promise} Promise which resolves to a list of buyer infos.
 */
const listBuyerInfos = async () => buyerInfos.listValues();

/**
 * @async
 * @function storeBuyerInfo
 * @param {String} id buyer information identifier
 * @param {Object} payload buyer information
 * @throws When field terms is not present
 */
const storeBuyerInfo = async (id, payload) => {
  const { category: { terms } } = payload;
  if (!terms) throw new Error('Field \'terms\' is required');
  if (!payload.name) throw new Error('Field \'name\' is required');
  if (!payload.logo) throw new Error('Field \'logo\' is required');
  const termsHash = web3.utils.sha3(terms).replace(/^0x/, '');
  buyerInfos.put(id, JSON.stringify({ ...payload, termsHash }));
};

/**
 * @async
 * @function associateBuyerInfoToOrder
 * @description Associates an order address with a buyerInfoId.
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {String} buyerInfoId the ID for the buyer info
 * @throws When the buyerInfoId does not exist
 * @returns {Promise} Promise which carries out the association
 */
const associateBuyerInfoToOrder = async (orderAddress, buyerInfoId) => {
  await buyerInfos.get(buyerInfoId); // we check existance
  const key = orderAddress.toLowerCase();
  await buyerInfoPerOrder.put(key, buyerInfoId);
};

/**
 * @async
 * @function getOrderInfo
 * @description Gets stored buyer info for a given data order
 * @param {String} orderAddress the ethereum address for the Data Order
 * @throws When there is no data for that orderAddress.
 * @returns {Promise} Promise which resolves to the buyer info of that Data Order.
 */
const getOrderInfo = async (orderAddress) => {
  const key = orderAddress.toLowerCase();
  const buyerInfoId = await buyerInfoPerOrder.get(key);
  const buyerInfo = await buyerInfos.get(buyerInfoId);
  return JSON.parse(buyerInfo);
};

export {
  getBuyerInfo,
  listBuyerInfos,
  storeBuyerInfo,
  associateBuyerInfoToOrder,
  getOrderInfo,
};
