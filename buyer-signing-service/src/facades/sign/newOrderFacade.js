import Response from '../Response';
import { accounts } from '../../helpers';
import {
  createDataBuilder,
  signTransaction,
} from '../../utils/wibson-lib';
import config from '../../../config';

const {
  getAddress,
  getPublicKey,
  getPrivateKey,
} = accounts;

/**
 * Generates a signed transaction for DataExchange.newOrder ready to be sent to
 * the network.
 *
 * @param {Number} nonce sender's transaction count
 * @param {String} gasPrice ethereum's current gas price
 * @param {Object} params transaction params
 * @param {Object} contract DataExchange contract instance
 * @returns {Response} with the result of the operation
 */
const newOrderFacade = (account, nonce, gasPrice, params, contract) => {
  const build = createDataBuilder(contract, 'newOrder');
  const response = build({ ...params, publicKey: getPublicKey(account) });
  const { errors } = response;

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const {
    chainId,
    dataExchange: {
      address,
      newOrder: { gasLimit },
    },
  } = config.contracts;

  const result = signTransaction(getPrivateKey(account), {
    from: getAddress(account),
    to: address,
    nonce,
    gasPrice,
    gasLimit,
    chainId,
    data: response.data,
  });

  return new Response(result);
};

export default newOrderFacade;
