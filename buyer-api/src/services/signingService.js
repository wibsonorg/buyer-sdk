import client from 'request-promise-native';
import config from '../../config';

/**
 * Signing Service url.
 * @type {String}
 */
const url = config.buyerSigningServiceUrl;

/**
 * We are not going to wait the signing service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 5000;

export const getHealth = () => client.get(`${url}/health`, { json: true, timeout });

/**
 * @typedef BuyerAccount
 * @property {string} address buyerId to get information of the buyer
 * @property {string} publicKey buyerId to get information of the buyer
 * @property {number} id buyerId to get information of the buyer
 */

/**
 * Buyer Account information from the signing service
 * @type {BuyerAccount}
 */
export const getAccount = () => client.get(`${url}/account`, {
  json: true,
  timeout,
});

const createSigningMethod = endpoint => payload =>
  client.post(`${url}${endpoint}`, { json: payload, timeout });

export const signCreateDataOrder = createSigningMethod('/sign/create-data-order');

export const signCloseDataOrder = createSigningMethod('/sign/close-data-order');

export const signTransfer = createSigningMethod('/sign/bat-pay/transfer');
