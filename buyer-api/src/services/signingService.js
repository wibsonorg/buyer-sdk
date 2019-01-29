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

export const getAccount = () => client.get(`${url}/account`, {
  json: true,
  timeout,
});

export const signCreateDataOrder = payload => client.post(
  `${url}/sign/create-data-order`,
  {
    json: payload,
    timeout,
  },
);

export const signCloseDataOrder = payload => client.post(
  `${url}/sign/close-data-order`,
  {
    json: payload,
    timeout,
  },
);

const signingService = {
  getHealth,
  getAccount,
  signCreateDataOrder,
  signCloseDataOrder,
};

export default signingService;
