import SolidityEvent from 'web3/lib/web3/event';
import Response from './Response';
import web3 from '../utils/web3';
import signingService from '../services/signingService';
import DataExchangeContract from '../contracts/definitions/DataExchange.json';

const toString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value.toString === 'function') return value.toString();
  return '';
};

const toInteger = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  return parseInt(value, 10);
};

/**
 * Builds DataOrder parameters.
 *
 * @param {Object} parameters.filters Target audience.
 * @param {String} parameters.dataRequest Requested data type (Geolocation,
 *                 Facebook, etc).
 * @param {Integer} parameters.price Price per Data Response added.
 * @param {String} parameters.initialBudgetForAudits The initial budget set for
 *                 future audits.
 * @param {String} parameters.termsAndConditions Buyer's terms and conditions
 *                 for the order.
 * @param {String} parameters.buyerURL Public URL of the buyer where the data
 *                 must be sent.
 * @returns {Object} Curated fields needed to create a DataOrder.
 */
const buildDataOrderParameters = ({
  filters,
  dataRequest,
  price,
  initialBudgetForAudits,
  termsAndConditions,
  buyerURL,
}) => ({
  filters: JSON.stringify(filters),
  dataRequest: toString(dataRequest),
  price: toInteger(price),
  initialBudgetForAudits: toInteger(initialBudgetForAudits),
  termsAndConditions: toString(termsAndConditions),
  buyerURL: toString(buyerURL),
});

const parseLogs = (logs, abi) => {
  const decoders = abi
    .filter(({ type }) => type === 'event')
    .map(json => new SolidityEvent(null, json, null));

  return logs.reduce((accumulator, log) => {
    const found = decoders.find((decoder) => {
      return decoder.signature() === log.topics[0].replace('0x', '');
    });

    if (found) {
      return [...accumulator, found.decode(log)];
    }

    return accumulator;
  }, []);
};

const extractEventArguments = (eventName, logs) => {
  const parsedLogs = parseLogs(logs, DataExchangeContract.abi);
  const { args } = parsedLogs.find(({ event }) => event === eventName);
  return args;
}

/**
 * @async
 * @param {Object} parameters.filters Target audience.
 * @param {String} parameters.dataRequest Requested data type (Geolocation,
 *                 Facebook, etc).
 * @param {Integer} parameters.price Price per Data Response added.
 * @param {String} parameters.initialBudgetForAudits The initial budget set for
 *                 future audits.
 * @param {String} parameters.termsAndConditions Buyer's terms and conditions
 *                 for the order.
 * @param {String} parameters.buyerURL Public URL of the buyer where the data
 *                 must be sent.
 * @returns {Response} The result of the operation.
 */
const createDataOrder = async (parameters) => {
  const dataOrderParameters = buildDataOrderParameters(parameters);

  if (dataOrderParameters.buyerURL.length === 0) {
    return new Response(null, ['Field \'buyerURL\' must be a valid URL']);
  }

  const { address } = await signingService.getAccount();
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService.signNewOrder({
    nonce,
    newOrderParameters: dataOrderParameters,
  });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  const tx = await web3.eth.getTransactionReceipt(receipt);

  const { orderAddress } = extractEventArguments('NewOrder', tx.logs);

  return new Response({ orderAddress });
};

export default createDataOrder;
