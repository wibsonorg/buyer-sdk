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
