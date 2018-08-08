import web3Utils from 'web3-utils';
import EthAbi from 'web3-eth-abi';
import { isPresent } from '../coercion';

const fetchMethodDefinition = (contract, methodName) => {
  const jsonInterface = contract.abi.find(({ name }) => name === methodName);

  if (!jsonInterface) {
    throw new Error(`Method ${methodName} does not belong to the contract's abi`);
  }

  const { inputs } = jsonInterface;
  const names = inputs
    .reduce((accumulator, { name }) => [...accumulator, name], []);

  return {
    jsonInterface,
    parameterNames: names,
    inputSchema: inputs,
  };
};

const typeValidator = {
  address: value => web3Utils.isAddress(value),
};

/**
 * @returns {Array}
 */
const validate = (inputSchema, parameters) =>
  inputSchema.reduce((accumulator, { name, type }) => {
    const value = parameters[name];
    const validator = typeValidator[type];

    if (!isPresent(value)) {
      return [...accumulator, `Field '${name}' is required`];
    }

    if (isPresent(validator) && !validator(value)) {
      return [...accumulator, `Field '${name}' is invalid or malformed`];
    }

    return accumulator;
  }, []);

/**
 * Creates an data builder function for a Contract's method.
 *
 * @param {Object} contract The contract definition
 * @param {String} methodName
 * @returns {Function} to build the data payload
 */
const createDataBuilder = (contract, methodName) =>
  (params) => {
    const {
      jsonInterface,
      parameterNames,
      inputSchema,
    } = fetchMethodDefinition(contract, methodName);

    const errors = validate(inputSchema, params);
    if (errors.length > 0) {
      return { errors };
    }

    const data = EthAbi.encodeFunctionCall(
      jsonInterface,
      parameterNames.map(name => params[name]),
    );

    return { errors, data };
  };

export { createDataBuilder };
