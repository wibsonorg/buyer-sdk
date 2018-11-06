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

const getHealth = () => client.get(`${url}/health`, { timeout });

const getAccount = account =>
  client.get(`${url}/accounts/${account}`, {
    json: true,
    timeout,
  });

const getAccounts = () =>
  client.get(`${url}/accounts`, {
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

const signAddNotaryToOrder = payload => client.post(
  `${url}/sign/add-notary-to-order`,
  {
    json: payload,
    timeout,
  },
);

const signIncreaseApproval = payload => client.post(
  `${url}/sign/increase-approval`,
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

const signCloseOrder = payload => client.post(
  `${url}/sign/close-order`,
  {
    json: payload,
    timeout,
  },
);

const signWIBTransfer = payload => client.post(
  `${url}/sign/transfer/wib`,
  {
    json: payload,
    timeout,
  },
);

const signETHTransfer = payload => client.post(
  `${url}/sign/transfer/eth`,
  {
    json: payload,
    timeout,
  },
);

const signinService = {
  getHealth,
  getAccount,
  getAccounts,
  signNewOrder,
  signAddNotaryToOrder,
  signIncreaseApproval,
  signAddDataResponse,
  signCloseDataResponse,
  signCloseOrder,
  signWIBTransfer,
  signETHTransfer,
};

export default signinService;
