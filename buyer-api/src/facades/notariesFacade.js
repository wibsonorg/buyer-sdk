import { notaries } from '../utils/stores';

/**
 * @async
 * @function getNotaryInfo
 * @param {String} address the notary's ethereum address.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const getNotaryInfo = async address => notaries.fetch(address);

/**
 * @async
 * @function getNotariesInfo
 * @param {Array} addresses specific notary addresses to fetch.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list with the notaries' information.
 */
const getNotariesInfo = async () => notaries.list();

export { getNotaryInfo, getNotariesInfo };
