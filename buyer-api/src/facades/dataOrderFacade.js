import Response from './Response';
import web3 from '../utils/web3';
import signingService from '../services/signingService';
// import { encodeJSON } from '../support/encoding';
import extractEventArguments from '../support/transaction';
import { DataExchangeContract } from '../contracts';
import config from '../../config';

const toString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value.toString === 'function') return value.toString();
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
  price: 0, // toInteger(price),
  initialBudgetForAudits: 0, // toInteger(initialBudgetForAudits),
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
const createDataOrder = async ({
  filters,
  dataRequest,
  price,
  initialBudgetForAudits,
  termsAndConditions,
  buyerURL,
}) => {
  const dataOrderParameters = buildDataOrderParameters({
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerURL,
  });

  if (dataOrderParameters.buyerURL.length === 0) {
    return new Response(null, ['Field \'buyerURL\' must be a valid URL']);
  }

  // const publicKey = await signingService.getPublicKey();
  // const newOrderPayload = web3.eth
  //   .contract(DataExchangeContract.abi)
  //   .at(config.contracts.addresses.dataExchange)
  //   .newOrder.getData(
  //     filters,
  //     dataRequest,
  //     price,
  //     initialBudgetForAudits,
  //     termsAndConditions,
  //     buyerURL,
  //     publicKey,
  //     () => { /* Because web3js */ },
  //   );

  const { signedTransaction } = await signingService.signNewOrder({
    nonce: 1,
    newOrderParameters: dataOrderParameters,
  });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  console.log(receipt);
  const { orderAddress } = extractEventArguments(receipt);

  return new Response({ orderAddress });
};

export default createDataOrder;
