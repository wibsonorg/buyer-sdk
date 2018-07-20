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

const getAccount = () => client.get(`${url}/account`, {
  json: true,
  timeout,
});

const signNewOrder = payload => client.post(
  `${url}/sign/new-order`,
  {
    json: payload,
    timeout,
  },
);

const signAddDataResponse = payload => client.post(
  `${url}/sign/add-data-response`,
  {
    json: payload,
    timeout,
  },
);

const signCloseDataResponse = payload => client.post(
  `${url}/sign/close-data-response`,
  {
    json: payload,
    timeout,
  },
);

const signAddNotaryToOrder = payload => client.post(
  `${url}/sign/add-notary-to-order`,
  {
    json: payload,
    timeout,
  },
);

const signinService = {
  getHealth,
  getAccount,
  signNewOrder,
  signAddNotaryToOrder,
  signAddDataResponse,
  signCloseDataResponse,
};

export default signinService;
