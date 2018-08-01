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
  getPublicKey,
  getPrivateKey,
} = buyer;

/**
 * Generates a signed transaction for DataExchange.newOrder ready to be sent to
 * the network.
 *
 * @param {Number} nonce Current transaction count + 1 of the sender
 * @param {Number} gasPrice
 * @param {Object} params
 * @returns {Response} with the result of the operation
 */
const newOrderFacade = (nonce, gasPrice, params, contract) => {
  const build = createDataBuilder(contract, 'newOrder');
  const response = build({ ...params, publicKey: getPublicKey() });
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
      newOrder: { gasLimit },
    },
  } = config.contracts;

  console.log('ENV', { chainId, address, gasLimit });

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

export default newOrderFacade;
