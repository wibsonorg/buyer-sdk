import Response from '../Response';
import { buyer, generateData, signTransaction } from '../../helpers';
import getDataExchangeMethodDefinition from '../../contracts';
import config from '../../../config';

const {
  functionSignature,
  parameterNames,
  schema,
} = getDataExchangeMethodDefinition('newOrder');

const {
  getAddress,
  getPublicKey,
  getPrivateKey,
} = buyer;

const isPresent = obj => obj !== null && obj !== undefined;

const validateNewOrderParameters = newOrderParameters =>
  schema.reduce((accumulator, { name }) => {
    // TODO: type validation/coercion should also be done
    const value = newOrderParameters[name];

    if (value === null || value === undefined) {
      return [...accumulator, `Field '${name}' is required`];
    }

    return accumulator;
  }, []);

/**
 * Checks that `nonce` and one of `newOrderParameters` or `newOrderPayload` are
 * present.
 *
 * @param {Integer} parameters.nonce Current transaction count + 1 of the sender
 * @param {Object} parameters.newOrderParameters New Order parameters
 * @param {Object} parameters.newOrderPayload Order data payload
 * @returns {Array} Error messages
 */
const validatePresence = ({ nonce, newOrderParameters, newOrderPayload }) => {
  let errors = [];

  if (!isPresent(nonce)) {
    errors = ['Field \'nonce\' is required'];
  }

  if (!isPresent(newOrderParameters) && !isPresent(newOrderPayload)) {
    errors = [
      ...errors,
      'Field \'newOrderParameters\' or \'newOrderPayload\' must be provided',
    ];
  }

  return errors;
};

const buildData = (newOrderParameters, newOrderPayload) => {
  if (isPresent(newOrderParameters)) {
    return generateData(functionSignature, parameterNames, newOrderParameters);
  }

  return newOrderPayload;
};

/**
 * Generates a signed transaction for DataExchange.newOrder ready to be sent to
 * the network.
 *
 * @param {Integer} parameters.nonce Current transaction count + 1 of the sender
 * @param {Object} parameters.newOrderParameters
 * @param {String} parameters.newOrderPayload
 * @returns {Response} with the result of the operation
 */
const newOrderFacade = ({ nonce, newOrderParameters, newOrderPayload }) => {
  const newOrder = { ...newOrderParameters, publicKey: getPublicKey() };

  let errors = validatePresence({ nonce, newOrderParameters, newOrderPayload });
  if (isPresent(newOrderParameters)) {
    errors = [...errors, ...validateNewOrderParameters(newOrder)];
  }

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const data = buildData(newOrder, newOrderPayload);

  try {
    const rawTransaction = {
      from: getAddress(),
      to: config.contracts.dataExchange.address,
      value: 0,
      nonce: '0x0',
      gasLimit: config.contracts.dataExchange.newOrder.gasLimit,
      chainId: config.contracts.chainId,
      data,
    };
    const result = signTransaction(rawTransaction, getPrivateKey());

    return new Response(result);
  } catch (error) {
    console.log(error);
    return new Response(null, [error]);
  }
};

export default newOrderFacade;
