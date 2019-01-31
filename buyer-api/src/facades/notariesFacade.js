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

/**
 * @async
 * @function getNotarizationRequest
 * @param {String} notarizationId the notarization request Id.
 *
 * @returns {Object} Notarization request Object.
 */
const getNotarizationRequest = (notarizationId) => {
  if (notarizationId === '0x87c2d362de99f75a4f2755cdaaad2d11bf6cc65dc71356593c445535ff28f43d') {
    return {
      orderId: 114,
      callbackUrl: 'http://api.wibson.org/notarization-result/0x87c2d362de99f75a4f2755cdaaad2d11bf6cc65dc71356593c445535ff28f43d',
      sellers: [
        {
          id: 78,
          address: '0x338fff484061da07323e994990c901d322b6927a',
          decryptionKeyHash: '0x32f2ab2ab2157408e0d8e8af2677f628ec82b5fc9329facb8fcc71cfb8f0b92e',
        },
        {
          id: 84,
          address: '0x2d419c641352e0baa7f54328ecabf58c5e4a56f1',
          decryptionKeyHash: '0x15e4d58cc37f15f2de3e688b4a21e5b5caa5263f9dd47db2011d8643cc59779f',
        },
      ],
    };
  }
  return null;
};

export { getNotaryInfo, getNotariesInfo, fetchAndCacheNotary, getNotarizationRequest };
