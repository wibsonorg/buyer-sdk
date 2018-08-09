import config from '../../config';
import { logger } from '../utils';

const notaryTTL = Number(config.contracts.cache.notaryTTL);

/**
 * @async
 * @function addNotaryToCache
 * @param {Object} notaryInfo the notary information to store in the cache
 * @param {Object} notariesCache Redis storage used for notaries caching
 * @returns {Promise} Promise which resolves to redis result
 */
const addNotaryToCache = (notaryInfo, notariesCache) =>
  notariesCache.set(notaryInfo[0], JSON.stringify(notaryInfo), 'EX', notaryTTL);

/**
 * @async
 * @function getNotaryInfo
 * @param {Object} web3 the web3 object.
 * @param {Object} dataExchange an instance of the DataExchange.
 * @param {String} address the notary's ethereum address.
 * @param {Object} notariesCache Redis storage used for notaries caching.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const getNotaryInfo = async (web3, dataExchange, address, notariesCache) => {
  let notaryInfo = await notariesCache.get(address);

  if (!notaryInfo) {
    logger.debug('Notary :: Cache Miss :: Fetching from blockchain...', { address });

    notaryInfo = await dataExchange.getNotaryInfo(address);

    if (notaryInfo[4]) {
      // if notary is registered in Data Exchange
      await addNotaryToCache(notaryInfo, notariesCache);
    }
  } else {
    logger.debug('Notary :: Cache Hit ::', { address });
    notaryInfo = JSON.parse(notaryInfo);
  }

  const publicUrls = JSON.parse(notaryInfo[2]);

  return {
    notary: notaryInfo[0],
    name: notaryInfo[1],
    publicUrl: publicUrls,
    publicUrls,
    publicKey: notaryInfo[3],
    isRegistered: notaryInfo[4],
  };
};

/**
 * @async
 * @function getNotariesInfo
 * @param {Object} web3 the web3 object.
 * @param {Object} dataExchange an instance of the DataExchange.
 * @param {Object} notariesCache Redis storage used for notaries caching.
 * @param {Array} addresses specific notary addresses to fetch.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list with the notaries' information.
 */
const getNotariesInfo = async (web3, dataExchange, notariesCache, addresses = []) => {
  const notaryAddresses = addresses.length > 0
    ? addresses
    : await dataExchange.getAllowedNotaries();

  const notaries = notaryAddresses.map(notaryAddress =>
    getNotaryInfo(web3, dataExchange, notaryAddress, notariesCache));

  return Promise.all(notaries);
};

export { getNotaryInfo, getNotariesInfo };
