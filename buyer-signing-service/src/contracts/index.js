import dxDefinition from '../../contracts/DataExchange.json';
import wibcoinDefinition from '../../contracts/Wibcoin.json';

const dxFunctionDefinitions = dxDefinition.abi
  .filter(({ type }) => type === 'function');

const wibcoinFunctionDefinitions = wibcoinDefinition.abi
  .filter(({ type }) => type === 'function');


/**
 * Extracts the method definition from the contract abi.
 * The return object includes the function signature:
 *  `newOrder(string,string, ...)`
 * Array with the names of the arguments preserving the order:
 *  `['filters','dataRequest', ...]`
 * And parameters scheme (useful for type coercion):
 *  `[{name: 'filters', type: 'string'},{name: 'filters', type: 'string'}, ...]`
 *
 * @param {String} methodName Name of the method of the contract
 * @returns {object} {
 *  functionSignature: String,
 *  parameterNames: Array,
 *  schema: Array
 * }
 */
const getContractMethodDefinition = (contractFunctionDefinitions, methodName) => {
  const jsonInterface = contractFunctionDefinitions.find(({ name }) => name === methodName);
  const { inputs } = jsonInterface;
  const names = inputs.reduce((accumulator, { name }) => [...accumulator, name], []);

  return {
    jsonInterface,
    parameterNames: names,
    inputSchema: inputs,
  };
};


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
const getDataExchangeMethodDefinition = methodName =>
  getContractMethodDefinition(dxFunctionDefinitions, methodName);

/**
 * Extracts Wibcoin's method definition from the contract abi.
 * The return object includes the function signature:
 *  `transfer(address,address, ...)`
 * Array with the names of the arguments preserving the order:
 *  `['from','to', ...]`
 * And parameters scheme (useful for type coercion):
 *  `[{name: 'from', type: 'address'},{name: 'to', type: 'address'}, ...]`
 *
 * @param {String} methodName Name of the Wibcoin's method
 * @returns {object} {
 *  functionSignature: String,
 *  parameterNames: Array,
 *  schema: Array
 * }
 */
const getWibcoinMethodDefinition = methodName =>
  getContractMethodDefinition(wibcoinFunctionDefinitions, methodName);

export { getDataExchangeMethodDefinition, getWibcoinMethodDefinition };
