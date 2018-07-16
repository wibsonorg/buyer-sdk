import dxDefinition from './definitions/DataExchange.json';

const dxFunctionDefinitions = dxDefinition.abi
  .filter(({ type }) => type === 'function');

/**
 * Extracts DataExchanges's method definition from the contract abi.
 * The return object includes the function signature:
 *  `newOrder(string,string, ...)`
 * Array with the names of the arguments preserving the order:
 *  `['filters','dataRequest', ...]`
 * And parameters scheme (useful for type coercion):
 *  `[{name: 'filters', type: 'string'},{name: 'filters', type: 'string'}, ...]`
 *
 * @param {String} methodName Name of the DataExchange's method
 * @returns {object} {
 *  functionSignature: String,
 *  parameterNames: Array,
 *  schema: Array
 * }
 */
const getDataExchangeMethodDefinition = (methodName) => {
  const jsonInterface = dxFunctionDefinitions.find(({ name }) => name === methodName);
  const { inputs } = jsonInterface;
  const names = inputs.reduce((accumulator, { name }) => [...accumulator, name], []);

  return {
    jsonInterface,
    parameterNames: names,
    inputSchema: inputs,
  };
};

export default getDataExchangeMethodDefinition;