import Response from '../Response';
import { buyer } from '../../helpers';
import {
  createDataBuilder,
  signTransaction,
} from '../../utils/wibson-lib';
import config from '../../../config';

const {
  getAddress,
  getPublicKey,
  getPrivateKey,
} = buyer;

/**
 * Generates a signed transaction for DataExchange.createDataOrder ready to be
 * sent to the network.
 *
 * @param {Number} nonce sender's transaction count
 * @param {String} gasPrice ethereum's current gas price
 * @param {Object} params transaction params
 * @param {Object} contract DataExchange contract instance
 * @returns {Response} with the result of the operation
 */
const createDataOrderFacade = (nonce, gasPrice, params, contract) => {
  const build = createDataBuilder(contract, 'createDataOrder');
  const { errors } = build({ ...params, publicKey: getPublicKey() });

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const {
    chainId,
    dataExchange: {
      address,
      createDataOrder: { gasLimit },
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

export default createDataOrderFacade;
