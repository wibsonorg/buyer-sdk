import Response from '../Response';
import { buyer } from '../../helpers';
import {
  createDataBuilder,
  signTransaction,
  isPresent,
} from '../../utils/wibson-lib';
import config from '../../../config';

const {
  getAddress,
  getPrivateKey,
} = buyer;

/**
 * Generates a signed transaction for DataExchange.addNotaryToOrder ready to be
 * sent to the network.
 *
 * @param {Integer} parameters.nonce Current transaction count + 1 of the sender
 * @param {Object} parameters.addNotaryToOrderParameters
 * @returns {Response} with the result of the operation
 */
const addNotaryToOrderFacade = (nonce, gasPrice, params, contract) => {
  const build = createDataBuilder(contract, 'addNotaryToOrder');
  const response = build(params);
  let { errors } = response;

  if (!isPresent(nonce)) {
    errors = [...errors, 'Field \'nonce\' is required'];
  }

  if (!isPresent(gasPrice)) {
    errors = [...errors, 'Field \'gasPrice\' is required'];
  }

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

  const result = signTransaction(getPrivateKey(), {
    from: getAddress(),
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
