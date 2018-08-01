import config from '../../config';
import { logger, createRedisStore } from '../utils';

const notaryCache = createRedisStore('cache.notary.');
const notaryTTL = Number(config.contracts.cache.notaryTTL);

/**
 * @async
 * @function addNotaryToCache
 * @param {Object} notaryInfo the notary information to store in the cache
 * @returns {Promise} Promise which resolves to redis result
 */
const addNotaryToCache = notaryInfo =>
  notaryCache.set(notaryInfo[0], JSON.stringify(notaryInfo), 'EX', notaryTTL);

/**
 * @async
 * @function fetchAndCacheNotary
 * @param {String} address the notary's ethereum address.
 * @param {Object} dataExchange an instance of the DataExchange.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const fetchAndCacheNotary = async (address, dataExchange) => {
  const notaryInfo = await dataExchange.getNotaryInfo(address);

  if (notaryInfo[4]) {
    // if notary is registered in Data Exchange
    await addNotaryToCache(notaryInfo);
  }

  return notaryInfo;
};

/**
 * @async
 * @function getNotaryInfo
 * @param {String} address the notary's ethereum address.
 * @param {Object} dataExchange an instance of the DataExchange.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const getNotaryInfo = async (address, dataExchange) => {
  let notaryInfo = await notaryCache.get(address);

  if (!notaryInfo) {
    logger.debug('Notary :: Cache Miss :: Fetching from blockchain...', { address });
    notaryInfo = await fetchAndCacheNotary(address, dataExchange);
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
 * @param {Object} dataExchange an instance of the DataExchange.
 * @param {Array} addresses specific notary addresses to fetch.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list with the notaries' information.
 */
const getNotariesInfo = async (dataExchange, addresses = []) => {
  const notaryAddresses = addresses.length > 0
    ? addresses
    : await dataExchange.getAllowedNotaries();

  const notaries = notaryAddresses.map(notaryAddress =>
    getNotaryInfo(notaryAddress, dataExchange));

  return Promise.all(notaries);
};

export { getNotaryInfo, getNotariesInfo };
