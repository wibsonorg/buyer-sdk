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

const increaseApprovalFacade = (nonce, gasPrice, params, contract) => {
  const build = createDataBuilder(contract, 'increaseApproval');
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
    wibcoin: {
      address,
      increaseApproval: { gasLimit },
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

export default increaseApprovalFacade;
