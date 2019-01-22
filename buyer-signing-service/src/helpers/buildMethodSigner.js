import { getAddress, getPrivateKey } from './buyer';
import {
  createDataBuilder,
  signTransaction,
} from '../utils/wibson-lib';
import config from '../../config';

export default (contract, method) => (nonce, gasPrice, params) => {
  const build = createDataBuilder(contract, method);
  const { errors, data } = build(params);

  if (errors.length > 0) {
    return { errors };
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
    data,
  });

  return { result };
};
