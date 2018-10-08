import Response from '../Response';
import { accounts } from '../../helpers';
import {
  createDataBuilder,
  signTransaction,
} from '../../utils/wibson-lib';

const {
  getRootAccountPrivateKey,
  getRootAccountAddress,
} = accounts;

/**
 * Generates a signed transaction for WIBToken.transfer ready to be sent to
 * the network.
 *
 * @param {Number} nonce sender's transaction count
 * @param {String} gasPrice ethereum's current gas price
 * @param {Object} params transaction params
 * @param {Object} contract WIBToken contract instance
 * @param {Object} defaults transaction defaults
 * @returns {Response} with the result of the operation
 */
const transferWIBFacade = (nonce, gasPrice, params, contract, defaults) => {
  const build = createDataBuilder(contract, 'transfer');
  const { errors, data } = build(params);

  if (errors.length > 0) return new Response(null, errors);

  const result = signTransaction(getRootAccountPrivateKey(), {
    ...defaults,
    from: getRootAccountAddress(),
    nonce,
    gasPrice,
    data,
  });

  return new Response(result);
};

export default transferWIBFacade;
