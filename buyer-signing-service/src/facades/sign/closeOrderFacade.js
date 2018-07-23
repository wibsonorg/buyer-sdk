import EthTx from 'ethereumjs-tx';
import { Buffer } from 'safe-buffer';
import Response from '../Response';
import { buyer, encodeFunctionCall } from '../../helpers';
import { getDataExchangeMethodDefinition } from '../../contracts';
import config from '../../../config';

const {
  jsonInterface,
  parameterNames,
  inputSchema,
} = getDataExchangeMethodDefinition('closeOrder');

const {
  getAddress,
  getPrivateKey,
} = buyer;

const isPresent = obj => obj !== null && obj !== undefined;

const validateParameters = parameters =>
  inputSchema.reduce((accumulator, { name }) => {
    // TODO: type validation/coercion should also be done
    const value = parameters[name];

    if (!isPresent(value)) {
      return [...accumulator, `Field '${name}' is required`];
    }

    return accumulator;
  }, []);

const buildData = parameters => encodeFunctionCall(
  jsonInterface,
  parameterNames.map(name => parameters[name]),
);

/**
 * Generates a signed transaction for DataExchange.closeOrder ready to be sent
 * to the network.
 *
 * @param {Integer} parameters.nonce Current transaction count + 1 of the sender
 * @param {Object} parameters.parameters
 * @returns {Response} with the result of the operation
 */
const closeOrderFacade = ({ nonce, ...parameters }) => {
  let errors = validateParameters(parameters);

  if (!isPresent(nonce)) {
    errors = [...errors, 'Field \'nonce\' is required'];
  }

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const {
    dataExchange: {
      address,
      closeOrder: { gasLimit },
    },
  } = config.contracts;

  const rawTransaction = {
    from: getAddress(),
    to: address,
    value: '0x00',
    nonce: `0x${nonce.toString(16)}`,
    gasLimit: `0x${parseInt(gasLimit, 10).toString(16)}`,
    // TODO: This must be set before deploying to production
    // chainId: config.contracts.chainId,
    data: buildData(parameters),
  };

  const tx = new EthTx(rawTransaction);
  tx.sign(Buffer.from(getPrivateKey(), 'hex'));

  const result = tx.serialize().toString('hex');

  return new Response(result);
};

export default closeOrderFacade;
