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

export default getBuyerInfo;
