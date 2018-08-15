import Response from './Response';
import { extractEventArguments } from './helpers';
import { web3, dataExchange } from '../utils';
import signingService from '../services/signingService';
import { coercion } from '../utils/wibson-lib';

const { toString, toInteger } = coercion;

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
  dataRequest: JSON.stringify(dataRequest),
  price: toInteger(price),
  initialBudgetForAudits: toInteger(initialBudgetForAudits),
  termsAndConditions: toString(termsAndConditions),
  buyerURL: JSON.stringify(buyerURL),
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
const createDataOrderFacade = async (parameters) => {
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
  const { logs } = await web3.eth.getTransactionReceipt(receipt);

  const { orderAddr: orderAddress } = extractEventArguments(
    'NewOrder',
    logs,
    dataExchange,
  );

  return new Response({ orderAddress });
};

export default createDataOrderFacade;
