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
} = getDataExchangeMethodDefinition('addNotaryToOrder');

const {
  getAddress,
  getPrivateKey,
} = buyer;

const isPresent = obj => obj !== null && obj !== undefined;

const validateParameters = parameters =>
  inputSchema.reduce((accumulator, { name }) => {
    // TODO: type validation/coercion should also be done
    const value = parameters[name];

    if (value === null || value === undefined) {
      return [...accumulator, `Field '${name}' is required`];
    }

    return accumulator;
  }, []);

const buildData = addNotaryToOrderParameters => encodeFunctionCall(
  jsonInterface,
  parameterNames.map(name => addNotaryToOrderParameters[name]),
);

/**
 * Checks that `nonce` and one of `addNotaryToOrderParameters` are present.
 *
 * @param {Integer} parameters.nonce Current transaction count + 1 of the sender
 * @param {Object} parameters.addNotaryToOrderParameters Add notary to order
 *                 parameters
 * @returns {Array} Error messages
 */
const validate = ({ nonce, addNotaryToOrderParameters }) => {
  let errors = [];

  if (!isPresent(nonce)) {
    errors = ['Field \'nonce\' is required'];
  }

  if (!isPresent(addNotaryToOrderParameters)) {
    errors = [...errors, 'Field \'addNotaryToOrderParameters\' is required'];
  } else {
    errors = [...errors, ...validateParameters(addNotaryToOrderParameters)];
  }

  return errors;
};

/**
 * Generates a signed transaction for DataExchange.addNotaryToOrder ready to be
 * sent to the network.
 *
 * @param {Integer} parameters.nonce Current transaction count + 1 of the sender
 * @param {Object} parameters.addNotaryToOrderParameters
 * @returns {Response} with the result of the operation
 */
const addNotaryToOrderFacade = ({ nonce, addNotaryToOrderParameters }) => {
  const errors = validate({ nonce, addNotaryToOrderParameters });

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const {
    dataExchange: {
      address,
      addNotaryToOrder: { gasLimit },
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
    data: buildData(addNotaryToOrderParameters),
  };

  const tx = new EthTx(rawTransaction);
  tx.sign(Buffer.from(getPrivateKey(), 'hex'));

  const result = tx.serialize().toString('hex');

  return new Response(result);
};

export default addNotaryToOrderFacade;
