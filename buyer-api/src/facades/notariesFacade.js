import { notaries } from '../utils/stores';
import * as notaryService from '../services/notaryService';

/**
 * @typedef NotaryInfo
 * @property {string} infoUrl Notary's API URL used to ask for its information.
 * @property {string} oldInfoUrl Notary's previous API URL, if it updated the information
 * or unregistered.
 * @property {boolean} isRegistered Flag indicating if the Notary is registered or not in
 * DataExchange.
 * @property {string} name Notary's name
 * @property {string} address Notary's ETH address
 * @property {string} notarizationUrl Notary's API URL used to request notarizations
 * @property {string} dataResponsesUrl Notary's API URL used to send data responses
 * @property {string} headsUpUrl Notary's API URL used to send heads-ups
 * @property {string} publicKey Notary's public key
 * @property {string} signature Notary's signature over the name, address, notarizationUrl,
 * dataResponsesUrl, headsUpUrl and publicKey.
 */

/**
 * @async
 * @function getNotaryInfo
 * @param {String} address the notary's ethereum address.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise<NotaryInfo>} Promise which resolves to the notary's onchain and
 * offchain information.
 */
const getNotaryInfo = async (address) => {
  const onchainInfo = await notaries.fetch(address);
  const { infoUrl } = onchainInfo;

  const additionalInfo = infoUrl && (await notaryService.getAdditionalNotaryInfo(infoUrl));
  return {
    ...onchainInfo,
    ...additionalInfo,
  };
};

/**
 * @async
 * @function getNotariesInfo
 * @param {Array} addresses specific notary addresses to fetch. Fetches all if param is undefined.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise<Array<NotaryInfo>>} Promise which resolves to the list with the
 * notaries' onchain and offchain information.
 */
const getNotariesInfo = async (specificAddresses) => {
  const addresses = specificAddresses || await notaries.list();
  const promises = addresses.map(address => getNotaryInfo(address));
  // TODO: I don't like this. If one service is not available, no data is shown
  return Promise.all(promises);
};

/**
 * @async
 * @function notarize
 * @param {string} address Notary's address.
 * @param {string} notarizationRequestId Notarization request internal ID.
 * @param {Object} payload Notarization request payload.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notarization response (not result).
 */
const notarize = async (address, notarizationRequestId, payload) => {
  const { notarizationUrl } = await getNotaryInfo(address);
  return notaryService.requestNotarization(notarizationUrl, notarizationRequestId, payload);
};

export { getNotaryInfo, getNotariesInfo, notarize };
