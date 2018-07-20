import web3Utils from 'web3-utils';
import { dateOrNull, getElements } from './helpers';

/**
 * @async
 * @function getSellerInfo
 * @param {Object} web3 the web3 object.
 * @param {Object} dataOrder an instance of the DataOrder.
 * @param {String} address the seller's ethereum address.
 * @throws When can not connect to blockchain.
 * @returns {Promise} Promise which resolves to the seller's information.
 */
const getSellerInfo = async (web3, dataOrder, address) => {
  const sellerInfo = await dataOrder.getSellerInfo(address);

  return {
    address,
    notaryAddress: sellerInfo[1],
    dataHash: sellerInfo[2],
    createdAt: dateOrNull(sellerInfo[3]),
    closedAt: dateOrNull(sellerInfo[4]),
    status: web3Utils.hexToUtf8(sellerInfo[5]),
  };
};

/**
 * @async
 * @function getNotariesInfo
 * @param {Object} web3 the web3 object.
 * @param {Object} dataOrder instance of a DataOrder.
 * @param {Array} addresses specific sellers addresses to fetch.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list with the sellers' information.
 */
const getSellersInfo = async (web3, dataOrder, addresses = []) => {
  const sellersAddresses = addresses.length > 0
    ? addresses
    : await getElements(dataOrder, 'sellers');

  const notaries = sellersAddresses.map(address =>
    getSellerInfo(web3, dataOrder, address));

  return Promise.all(notaries);
};

export { getSellerInfo, getSellersInfo };
