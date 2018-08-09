import Response from './Response';
import { performTransaction, sendTransaction } from './helpers';
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
 * @param {Array} parameters.notaries Ethereum addresses of the notaries
 *                 involved.
 * @param {String} parameters.buyerInfoId The ID for the buyer info.
 * @param {Object} contract DataExchange contract
 * @param {Object} dataOrderQueue DataOrder's queue object
 * @returns {Response} The result of the operation.
 */
const createDataOrderFacade = async (
  { notaries, buyerInfoId, ...parameters },
  contract,
  dataOrderQueue,
) => {
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
        addedValue: params.initialBudgetForAudits, // TODO: This needs to be converted
      },
    );
  }

  const receipt = await sendTransaction(
    web3,
    address,
    signingService.signNewOrder,
    params,
  );

  dataOrderQueue.add('fetchOrderAddress', { receipt, notaries, buyerInfoId }, {
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });

  return new Response({ status: 'pending', receipt });
};

export default createDataOrderFacade;
