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
 * @param {Object} parameters.params Transaction parameters
 * @returns {Array} Error messages
 */
const validate = ({ nonce, params }) => {
  let errors = [];

  if (!nonce === null || nonce === undefined) {
    errors = ['Field \'nonce\' is required'];
  }

  return schema.reduce((accumulator, { name }) => {
    // TODO: type validation/coercion should also be done
    const value = params[name];

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
 * @param {Object} parameters.transactionParameters
 * @returns {Response} with the result of the operation
 */
const newOrderFacade = ({ nonce, transactionParameters }) => {
  const params = { ...transactionParameters, publicKey: getPublicKey() };
  const errors = validate({ nonce, params });

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const rawTransaction = {
    from: getAddress(),
    to: config.contracts.dataExchange.address,
    value: 0,
    nonce,
    gasLimit: config.contracts.dataExchange.newOrder.gasLimit,
    chainId: config.contracts.chainId,
    data: generateData(
      functionSignature,
      parameterNames,
      params,
    ),
  };

  return new Response(signTransaction(rawTransaction, getPrivateKey()));
};

export default newOrderFacade;
