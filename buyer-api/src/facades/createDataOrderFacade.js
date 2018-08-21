import Response from './Response';
import {
  getTransactionReceipt,
  extractEventArguments,
  performTransaction,
  sendTransaction,
} from './helpers';
import { web3, dataExchange } from '../utils';
import signingService from '../services/signingService';
import { coercion, coin } from '../utils/wibson-lib';

const { toString } = coercion;
const { fromWib } = coin;

/**
 * Builds DataOrder parameters.
 *
 * @param {Object} parameters.filters Target audience.
 * @param {String} parameters.dataRequest Requested data type (Geolocation,
 *                 Facebook, etc).
 * @param {String} parameters.price Price per Data Response added.
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
  price: fromWib(price),
  initialBudgetForAudits: fromWib(initialBudgetForAudits),
  // TODO: remove before deploy to main net
  termsAndConditions: toString(termsAndConditions).substring(0, 100),
  buyerURL: JSON.stringify(buyerURL),
});

/**
 * @async
 * @param {Object} parameters.filters Target audience.
 * @param {String} parameters.dataRequest Requested data type (Geolocation,
 *                 Facebook, etc).
 * @param {String} parameters.price Price per Data Response added.
 * @param {String} parameters.initialBudgetForAudits The initial budget set for
 *                 future audits.
 * @param {String} parameters.termsAndConditions Buyer's terms and conditions
 *                 for the order.
 * @param {String} parameters.buyerURL Public URL of the buyer where the data
 *                 must be sent.
 * @param {Array} parameters.notaries Ethereum addresses of the notaries
 *                 involved.
 * @param {String} parameters.buyerInfoId The ID for the buyer info.
 * @param {Object} dataOrderQueue DataOrder's queue object
 * @returns {Response} The result of the operation.
 */
const createDataOrderFacade = async (
  { notaries, buyerInfoId, ...parameters },
  dataOrderQueue,
) => {
  const params = buildDataOrderParameters(parameters);

  if (params.buyerURL.length === 0) {
    return new Response(null, ['Field \'buyerURL\' must be a valid URL']);
  }

  if (notaries.length === 0) {
    return new Response(null, ['Field \'notaries\' must contain at least one notary address']);
  }

  const { address } = await signingService.getAccount();

  if (params.initialBudgetForAudits > 0) {
    await performTransaction(
      web3,
      address,
      signingService.signIncreaseApproval,
      {
        spender: dataExchange.address,
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

  dataOrderQueue.add('dataOrderSent', { receipt, notaries, buyerInfoId }, {
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });

  return new Response({ status: 'pending', receipt });
};

/**
 * @async
 * @param {String} receipt Transaction hash.
 * @param {Array} notaries Ethereum addresses of the notaries involved.
 * @param {String} buyerInfoId The ID for the buyer info.
 * @param {Object} dataOrderQueue DataOrder's queue object.
 */
const onDataOrderSent = async (
  receipt,
  notaries,
  buyerInfoId,
  dataOrderQueue,
) => {
  const { logs } = await getTransactionReceipt(web3, receipt);
  const { orderAddr } = extractEventArguments(
    'NewOrder',
    logs,
    dataExchange,
  );

  dataOrderQueue.add('addNotariesToOrder', {
    orderAddr,
    notaries,
  }, {
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });

  dataOrderQueue.add('associateBuyerInfoToOrder', {
    orderAddr,
    buyerInfoId,
  }, {
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });
};

export { createDataOrderFacade, onDataOrderSent };
