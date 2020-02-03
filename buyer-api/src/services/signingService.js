import axios from 'axios';
import { URL } from 'url';
import config from '../../config';

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * We are not going to wait the signing service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 5000;
const url = path => new URL(`/${path}`, config.buyerSigningServiceUrl).toString();

const createSignMethod = method => payload =>
  axios.post(url(`sign/${method}`), { timeout, httpsAgent, ...payload }).then(res => res.data);

const createGetter = endpoint => () =>
  axios.get(url(endpoint), { timeout, httpsAgent }).then(res => res.data);

export const getHealth = createGetter('health');
export const getAccount = createGetter('account');

export const signCreateDataOrder = createSignMethod('create-data-order');
export const signCloseDataOrder = createSignMethod('close-data-order');
export const signRegisterPayment = createSignMethod('bat-pay/register-payment');
export const signDeposit = createSignMethod('bat-pay/deposit');
export const signIncreaseApproval = createSignMethod('token/increase-approval');
