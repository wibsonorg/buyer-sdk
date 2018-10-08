import Response from '../Response';
import { accounts } from '../../helpers';
import { signTransaction, isPresent } from '../../utils/wibson-lib';

const {
  getRootAccountPrivateKey,
  getRootAccountAddress,
} = accounts;

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
