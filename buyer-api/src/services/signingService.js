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
const timeout = 1000;

const getHealth = () => client.get(`${url}/health`, { timeout });

const getPublicKey = () => client.get(`${url}/public-key`, { timeout });

const signNewOrder = payload => client.post(
  `${url}/sign/new-order`,
  {
    json: payload,
    timeout,
  },
);

const signinService = {
  getHealth,
  getPublicKey,
  signNewOrder,
};

export default signinService;
