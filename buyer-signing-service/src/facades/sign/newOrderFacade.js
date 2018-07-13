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

/**
 * @param {Integer} parameters.nonce Current transaction count + 1 of the sender
 * @param {Object} parameters.newOrderParameters New Order parameters
 * @returns {Array} Error messages
 */
const validate = ({ nonce, newOrderParameters }) => {
  let errors = [];

  if (!nonce === null || nonce === undefined) {
    errors = ['Field \'nonce\' is required'];
  }

  return schema.reduce((accumulator, { name }) => {
    // TODO: type validation/coercion should also be done
    const value = newOrderParameters[name];

    if (value === null || value === undefined) {
      return [...accumulator, `Field '${name}' is required`];
    }

    return accumulator;
  }, errors);
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
  let data = newOrderPayload;

  if (newOrderParameters !== null) {
    const params = { ...newOrderParameters, publicKey: getPublicKey() };
    const errors = validate({ nonce, newOrderParameters: params });

    if (errors.length > 0) {
      return new Response(null, errors);
    }

    data = generateData(functionSignature, parameterNames, params);
  }

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
