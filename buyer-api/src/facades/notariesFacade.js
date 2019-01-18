import config from '../../config';
import { logger, dataExchange } from '../utils';
import { notariesCache } from '../utils/stores';

const notaryTTL = Number(config.contracts.cache.notaryTTL);

/**
 * @async
 * @function addNotaryToCache
 * @param {Object} notaryInfo the notary information to store in the cache
 * @returns {Promise} Promise which resolves to redis result
 */
const addNotaryToCache = notaryInfo =>
  notariesCache.set(
    notaryInfo.notary.toLowerCase(),
    JSON.stringify(notaryInfo),
    'EX',
    notaryTTL,
  );

const fetchNotaryFromCache = notaryAddress =>
  notariesCache.get(notaryAddress.toLowerCase());

/**
 * @async
 * @function fetchAndCacheNotary
 * @param {String} address the ethereum address for the Notary
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const fetchAndCacheNotary = async (address) => {
  const notaryInfo = await dataExchange.methods.getNotaryInfo(address).call();
  const publicUrls = JSON.parse(notaryInfo[2]);

  const parsedNotaryInfo = {
    notary: (notaryInfo[0]).toLowerCase(),
    name: notaryInfo[1],
    publicUrl: publicUrls,
    publicUrls,
    publicKey: notaryInfo[3],
    isRegistered: notaryInfo[4],
  };
  await addNotaryToCache(parsedNotaryInfo);

  return parsedNotaryInfo;
};

/**
 * @async
 * @function getNotaryInfo
 * @param {String} address the notary's ethereum address.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const getNotaryInfo = async (address) => {
  const cachedNotaryInfo = await fetchNotaryFromCache(address);
  if (cachedNotaryInfo) {
    logger.debug('Notary :: Cache Hit ::', { address });
    return JSON.parse(cachedNotaryInfo);
  }

  logger.debug('Notary :: Cache Miss :: Fetching from blockchain... ::', { address });
  return fetchAndCacheNotary(address);
};

/**
 * @async
 * @function getNotariesInfo
 * @param {Array} addresses specific notary addresses to fetch.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list with the notaries' information.
 */
const getNotariesInfo = async (addresses = []) => {
  const notaryAddresses = addresses.length > 0
    ? addresses
    : await dataExchange.methods.getAllowedNotaries().call();

  const notaries = notaryAddresses.map(notaryAddress =>
    getNotaryInfo(notaryAddress));

  return Promise.all(notaries);
};

export { getNotaryInfo, getNotariesInfo, fetchAndCacheNotary };
