import apicache from 'apicache';
import { notaries } from '../../utils/stores';

const updateNotary = async ({ notary, ...params }) => {
  await notaries.update(notary.toLowerCase(), params);
  apicache.clear('/notaries/*');
};

/**
 * @typedef NotaryRegisteredEventValues
 * @property {string} notary The registered notary
 * @property {string} notaryUrl The notary's URL for off-chain data

 * @callback onNotaryRegistered Updates the notary in the store with data from the DataExchange
 * @param {NotaryRegisteredEventValues} eventValues The values emmited by the DataExchange event
 */
export const onNotaryRegistered = async ({ notary, notaryUrl }) =>
  updateNotary({ notary, infoUrl: notaryUrl, isRegistered: true });

/**
 * @typedef NotaryUpdatedEventValues
 * @property {string} notary The registered notary
 * @property {string} oldNotaryUrl The notary's old URL for off-chain data
 * @property {string} newNotaryUrl The notary's new URL for off-chain data
 *
 * @callback onNotaryUpdated Updates the notary in the store with data from the DataExchange
 * @param {NotaryUpdatedEventValues} eventValues The values emmited by the DataExchange event
 */
export const onNotaryUpdated = async ({ notary, oldNotaryUrl, newNotaryUrl }) =>
  updateNotary({ notary, infoUrl: newNotaryUrl, oldInfoUrl: oldNotaryUrl });

/**
 * @typedef NotaryUnregisteredEventValues
 * @property {string} notary The registered notary
 * @property {string} oldNotaryUrl The notary's old URL for off-chain data
 *
 * @callback onNotaryUnregistered Deletes the notary in the store
 * @param {NotaryUnregisteredEventValues} eventValues The values emmited by the DataExchange event
 */
export const onNotaryUnregistered = async ({ notary, oldNotaryUrl }) =>
  updateNotary({
    notary,
    infoUrl: undefined,
    oldInfoUrl: oldNotaryUrl,
    isRegistered: false,
  });
