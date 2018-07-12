import Response from '../Response';
import { buyer, generateData, signTransaction } from '../../helpers';
import getDataExchangeMethodSignature from '../../contracts';
import config from '../../../config';

const {
  functionSignature,
  parameterNames,
  schema,
} = getDataExchangeMethodSignature('newOrder');

const {
  getAddress,
  getPublicKey,
  getPrivateKey,
} = buyer;

/**
 * @returns {Array} Error messages
 */
const validate = ({ nonce, gasPrice, params }) => {
  let errors = [];

  if (!nonce === null || nonce === undefined) {
    errors = ['Field \'nonce\' is required'];
  }

  if (gasPrice === null || gasPrice === undefined) {
    errors = [...errors, 'Field \'gasPrice\' is required'];
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
 * Generates a signed transaction ready to be sent to the network.
 *
 * @param {integer} nonce Current transaction count + 1 of the sender
 * @param {integer} gasPrice Gas price determined by the sender in wei (IS THIS OK?)
 * @param {object} transactionParameters
 * @returns {Response} with the result of the operation
 */
const newOrderFacade = ({ nonce, gasPrice, transactionParameters }) => {
  const params = { ...transactionParameters, publicKey: getPublicKey() };
  const errors = validate({ nonce, gasPrice, params });

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const rawTransaction = {
    from: getAddress(),
    to: config.contracts.addresses.dataExchange,
    value: 0,
    nonce,
    gasPrice,
    gasLimit: config.transactions.newOrder.gasLimit,
    data: generateData(
      functionSignature,
      parameterNames,
      params,
    ),
  };

  return new Response(signTransaction(rawTransaction, getPrivateKey()));
};

export default newOrderFacade;
