import apicache from 'apicache';
import { notaries } from '../../utils/stores';

/**
 * @typedef NotaryRegisteredEventValues
 * @property {string} notary The registered notary
 * @property {string} notaryUrl The notary's URL for off-chain data

 * @callback onNotaryRegistered Updates the notary in the store with data from the DataExchange
 * @param {NotaryRegisteredEventValues} eventValues The values emmited by the DataExchange event
 */
export const onNotaryRegistered = async ({ notary, notaryUrl }) => {
  const offchainData = {
    name: 'Fake Notary',
    address: '0x7befc633bd282f7938ef8349a9fca281cf06bada',
    notarizationUrl: 'http://localhost:9200/buyers/notarization-request',
    dataResponsesUrl: 'http://10.0.2.2:9200/data-responses',
    isRegistered: false,
    headsUpUrl: 'http://localhost:9200/sellers/heads-up',
    publicKey: 'some-public-key',
  };
  return notaries.store(notary.toLowerCase(), offchainData);
};

/**
 * @callback closeDataOrder Updates DataOrder in the store with closed status
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event
 *
 * @function onDataOrderClosed Creates a closeDataOrder
 * @returns {closeDataOrder}
 */
export const onNotaryUpdated = async ({ notary, oldNotaryUrl, newNotaryUrl }) => {

};

export const onNotaryUnregistered = async ({ notary, oldNotaryUrl }) => {

};
