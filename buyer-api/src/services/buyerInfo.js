/**
 * @async
 * @function getBuyerInfo
 * @description Gets stored buyer info for a given data order
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {Object} buyerInfoPerOrder Level Storage with orderAddress: buyerInfoId
 * @param {Object} buyerInfos Level Storage with buyerInfoId: info
 * @throws When there is no data for that orderAddress.
 * @returns {Promise} Promise which resolves to the buyer info of that Data Order.
 */
const getBuyerInfo = async (orderAddress, buyerInfoPerOrder, buyerInfos) => {
  const buyerInfoId = await buyerInfoPerOrder.get(orderAddress);
  const buyerInfo = await buyerInfos.get(buyerInfoId);
  return JSON.parse(buyerInfo);
};

/**
 * @async
 * @function associateBuyerInfoToOrder
 * @description Associates an order address with a buyerInfoId.
 * @param {String} orderAddress the ethereum address for the Data Order
 * @param {String} buyerInfoId the ID for the buyer info
 * @param {Object} buyerInfoPerOrder Level Storage with orderAddress: buyerInfoId
 * @param {Object} buyerInfos Level Storage with buyerInfoId: info
 * @throws When the buyerInfoId does not exist
 * @returns {Promise} Promise which carries out the association
 */
const associateBuyerInfoToOrder = async (
  orderAddress,
  buyerInfoId,
  buyerInfoPerOrder,
  buyerInfos,
) => {
  await buyerInfos.get(buyerInfoId); // we check existance
  await buyerInfoPerOrder.put(orderAddress, buyerInfoId);
};

export { getBuyerInfo, associateBuyerInfoToOrder };
