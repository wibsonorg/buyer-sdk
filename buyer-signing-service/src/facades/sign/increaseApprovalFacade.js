import EthTx from 'ethereumjs-tx';
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

const increaseApprovalFacade = (nonce, params) => {
  const errors = validatePresence({ nonce, params }, validateParameters);

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const rawTransaction = {
    from: getAddress(),
    to: config.contracts.wibcoin.address,
    value: '0x00',
    nonce: `0x${nonce.toString(16)}`,
    gasLimit: `0x${parseInt(config.contracts.wibcoin.increaseApproval.gasLimit, 10).toString(16)}`,
    // TODO: This must be set before deploying to production
    // chainId: config.contracts.chainId,
    data: buildData(params),
  };

  const tx = new EthTx(rawTransaction);
  tx.sign(Buffer.from(getPrivateKey(), 'hex'));

  const result = tx.serialize().toString('hex');

  return new Response(result);
};

export default increaseApprovalFacade;
