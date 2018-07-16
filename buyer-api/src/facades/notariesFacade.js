import config from '../../config';
import getContracts from '../contracts';
import { logger, createRedisStore } from '../utils';

const dataExchangeAddress = config.contracts.addresses.dataExchange;

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
 * @function getNotaryInfo
 * @param {Object} web3 the web3 object.
 * @param {String} address the notary's ethereum address.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const getNotaryInfo = async (web3, address) => {
  let notaryInfo = await notaryCache.get(address);

  if (!notaryInfo) {
    logger.debug('Notary :: Cache Miss :: %s :: Fetching from blockchain...', address);

    const { dataExchange } = await getContracts({ web3, dataExchangeAddress });
    notaryInfo = await dataExchange.getNotaryInfo(address);

    if (notaryInfo[4]) {
      // if notary is registered in Data Exchange
      await addNotaryToCache(notaryInfo);
    }
  } else {
    logger.debug('Notary :: Cache Hit :: %s', address);
    notaryInfo = JSON.parse(notaryInfo);
  }

  return {
    notary: notaryInfo[0],
    name: notaryInfo[1],
    publicUrl: notaryInfo[2],
    publicKey: notaryInfo[3],
    isRegistered: notaryInfo[4],
  };
};

/**
 * @async
 * @function getNotariesInfo
 * @param {Object} web3 the web3 object.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list with the notaries' information.
 */
const getNotariesInfo = async (web3) => {
  const { dataExchange } = await getContracts({ web3, dataExchangeAddress });

  const notaryAddresses = await dataExchange.getAllowedNotaries();
  const notaries = notaryAddresses.map(notaryAddress => getNotaryInfo(web3, notaryAddress));

  return Promise.all(notaries);
};

export { getNotaryInfo, getNotariesInfo };
