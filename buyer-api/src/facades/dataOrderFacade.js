import Response from './Response';
import web3 from '../utils/web3';
import signingService from '../services/signingService';
import extractEventArguments from '../support/transaction';

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
  console.log('Start createDataOrder');
  const dataOrderParameters = buildDataOrderParameters(parameters);

  if (dataOrderParameters.buyerURL.length === 0) {
    return new Response(null, ['Field \'buyerURL\' must be a valid URL']);
  }

  const nonce = await web3.eth.getTransactionCount('0xc491D1A5ea0908A1864612AdaCA88852fF21C228');
  console.log('nonce', nonce.toString(16));
  const { signedTransaction } = await signingService.signNewOrder({
    nonce,
    newOrderParameters: dataOrderParameters,
  });

  console.log('SignedTransaction', signedTransaction);
  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);

  console.log(receipt);
  const { orderAddress } = extractEventArguments(receipt);

  return new Response({ orderAddress });
};

export default createDataOrder;
