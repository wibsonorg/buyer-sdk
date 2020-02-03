import client from 'request-promise-native';
import config from '../../config';

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

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

export const getHealth = () => client.get(`${url}/health`, { json: true, timeout, pool: httpsAgent });

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
export const getAccount = () =>
  client.get(`${url}/account`, {
    json: true,
    timeout,
    pool: httpsAgent,
  });

const createSigningMethod = endpoint => payload =>
  client.post(`${url}${endpoint}`, { json: payload, timeout, pool: httpsAgent });

export const signCreateDataOrder = createSigningMethod('/sign/create-data-order');
export const signCloseDataOrder = createSigningMethod('/sign/close-data-order');
export const signRegisterPayment = createSigningMethod('/sign/bat-pay/register-payment');
export const signDeposit = createSigningMethod('/sign/bat-pay/deposit');
export const signIncreaseApproval = createSigningMethod('/sign/token/increase-approval');
