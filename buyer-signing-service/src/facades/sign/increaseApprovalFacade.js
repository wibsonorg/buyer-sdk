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

const increaseApprovalFacade = (account, nonce, gasPrice, params, contract) => {
  const build = createDataBuilder(contract, 'increaseApproval');
  const response = build(params);
  const { errors } = response;

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

export default increaseApprovalFacade;
