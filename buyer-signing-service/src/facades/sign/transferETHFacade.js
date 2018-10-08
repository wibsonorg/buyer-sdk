import Response from '../Response';
import { accounts } from '../../helpers';
import { signTransaction, isPresent } from '../../utils/wibson-lib';

const {
  getRootAccountPrivateKey,
  getRootAccountAddress,
} = accounts;

/**
 * Generates a signed transaction to transfer Ether ready to be sent to
 * the network.
 *
 * @param {Number} nonce sender's transaction count
 * @param {String} gasPrice ethereum's current gas price
 * @param {Object} params transaction params
 * @param {Object} contract WIBToken contract instance
 * @param {Object} defaults transaction defaults
 * @returns {Response} with the result of the operation
 */
const transferETHFacade = (nonce, gasPrice, params, contract, defaults) => {
  const { _to, _value } = params;

  let errors = [];
  if (!isPresent(_to)) errors = ['Field \'_to\' is required'];
  if (!isPresent(_value)) errors = [...errors, 'Field \'_value\' is required'];
  if (errors.length > 0) return new Response(null, errors);

  const result = signTransaction(getRootAccountPrivateKey(), {
    ...defaults,
    from: getRootAccountAddress(),
    to: _to,
    nonce,
    gasPrice,
    value: _value,
  });

  return new Response(result);
};

export default transferETHFacade;
