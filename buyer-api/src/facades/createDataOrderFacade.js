import Response from './Response';
import { extractEventArguments, performTransaction } from './helpers';
import web3 from '../utils/web3';
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
  // TODO: remove before deploy to main net
  termsAndConditions: toString(termsAndConditions).substring(0, 100),
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
 * @param {Object} contract DataExchange contract
 * @returns {Response} The result of the operation.
 */
const createDataOrderFacade = async (parameters, contract) => {
  const params = buildDataOrderParameters(parameters);

  if (params.buyerURL.length === 0) {
    return new Response(null, ['Field \'buyerURL\' must be a valid URL']);
  }

  const { address } = await signingService.getAccount();


  if (params.initialBudgetForAudits > 0) {
    await performTransaction(
      web3,
      address,
      signingService.signIncreaseApproval,
      {
        spender: contract.address,
        addedValue: params.initialBudgetForAudits,
      },
    );
  }

  const { error, tx } = await performTransaction(
    web3,
    address,
    signingService.signNewOrder,
    params,
  );

  console.log('response', { error, tx });

  if (error) {
    return new Response(null, [error]);
  }

  const { orderAddr: orderAddress } = extractEventArguments(
    'NewOrder',
    tx.logs,
    contract,
  );

  return new Response({ orderAddress });
};

export default createDataOrderFacade;
