import EthTx from 'ethereumjs-tx';
import web3Utils from 'web3-utils';
import { Buffer } from 'safe-buffer';
import Response from '../Response';
import { buyer, encodeFunctionCall, validatePresence } from '../../helpers';
import { getWibcoinMethodDefinition } from '../../contracts';
import config from '../../../config';

const {
  jsonInterface,
  parameterNames,
  inputSchema,
} = getWibcoinMethodDefinition('increaseApproval');

const {
  getAddress,
  getPrivateKey,
} = buyer;

const validateParameters = parameters =>
  inputSchema.reduce((accumulator, { name }) => {
    // TODO: type validation/coercion should also be done
    const value = parameters[name];

    if (value === null || value === undefined) {
      return [...accumulator, `Field '${name}' is required`];
    }

    return accumulator;
  }, []);

const buildData = params => encodeFunctionCall(
  jsonInterface,
  parameterNames.map(name => params[name]),
);

const increaseApprovalFacade = (nonce, gasPrice, params) => {
  const errors = validatePresence({ nonce, params }, validateParameters);
  console.log('increase', { nonce, gasPrice, params });

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

  const rawTransaction = {
    from: getAddress(),
    to: address,
    value: '0x00',
    nonce: web3Utils.numberToHex(nonce),
    gasPrice: web3Utils.numberToHex(3),
    gasLimit: web3Utils.numberToHex(gasLimit),
    chainId,
    data: buildData(params),
  };

  const tx = new EthTx(rawTransaction);
  tx.sign(Buffer.from(getPrivateKey(), 'hex'));

  const result = tx.serialize().toString('hex');

  return new Response(result);
};

export default increaseApprovalFacade;
