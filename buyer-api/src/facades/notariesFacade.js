import config from '../../config';
import getContracts from '../contracts';
import { logger, redisClient } from '../utils';

const dataExchangeAddress = config.contracts.addresses.dataExchange;

const notaryCache = redisClient('cache.notary');
const notaryTTL = Number(config.contracts.cache.notaryTTL);

/**
 * @async
 * @function getNotaryInfo
 * @param {Object} web3 the web3 object.
 * @param {String} address the notary's ethereum address.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const getNotaryInfo = async (web3, address) => {
  const { dataExchange } = await getContracts({ web3, dataExchangeAddress });

  let notaryInfo = await notaryCache.get(address);
  if (!notaryInfo) {
    logger.debug('Notary :: Cache Miss :: %s :: Fetching from blockchain...', address);
    notaryInfo = await dataExchange.getNotaryInfo(address);
    await notaryCache.set(notaryInfo[0], notaryInfo, 'EX', notaryTTL);
  } else {
    logger.debug('Notary :: Cache Hit :: %s', address);
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
