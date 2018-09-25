import Response from '../Response';
import { accounts } from '../../helpers';
import {
  createDataBuilder,
  signTransaction,
} from '../../utils/wibson-lib';
import config from '../../../config';

const {
  getAddress,
  getPrivateKey,
} = accounts;

/**
 * Generates a signed transaction for DataExchange.addNotaryToOrder ready to be
 * sent to the network.
 *
 * @param {Number} nonce Sender's transaction count
 * @param {String} gasPrice ethereum's current gas price
 * @param {Object} params transaction params
 * @param {Object} contract DataExchange contract instance
 * @returns {Response} with the result of the operation
 */
const addNotaryToOrderFacade = (account, nonce, gasPrice, params, contract) => {
  const build = createDataBuilder(contract, 'addNotaryToOrder');
  const response = build(params);
  const { errors } = response;

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const {
    chainId,
    dataExchange: {
      address,
      addNotaryToOrder: { gasLimit },
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

export default addNotaryToOrderFacade;
