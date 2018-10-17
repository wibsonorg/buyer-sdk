import Response from './Response';
import {
  getTransactionReceipt,
  extractEventArguments,
  performTransaction,
  sendTransaction,
} from './helpers';
import { web3, dataExchange } from '../utils';
import signingService from '../services/signingService';
import { getBuyerInfo } from '../services/buyerInfo';
import { coercion, coin } from '../utils/wibson-lib';
import config from '../../config';

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
 * @param {String} parameters.termsAndConditions Terms and conditions hash
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
  filters: JSON.stringify(filters.reduce((accum, { filter, values }) =>
    ({ ...accum, [filter]: values }), {})),
  dataRequest: JSON.stringify(dataRequest),
  price: fromWib(price),
  initialBudgetForAudits: fromWib(initialBudgetForAudits),
  termsAndConditions: toString(termsAndConditions),
  buyerURL: JSON.stringify(buyerURL),
});

/**
 * @async
 * @param {Object} parameters.account Account that sends the transaction.
 * @param {Object} parameters.totalAccounts Number of children accounts.
 * @param {Object} parameters.filters Target audience.
 * @param {String} parameters.dataRequest Requested data type (Geolocation,
 *                 Facebook, etc).
 * @param {String} parameters.price Price per Data Response added.
 * @param {String} parameters.initialBudgetForAudits The initial budget set for
 *                 future audits.
 * @param {String} parameters.buyerURL Public URL of the buyer where the data
 *                 must be sent.
 * @param {Array} parameters.notaries Ethereum addresses of the notaries
 *                 involved.
 * @param {String} parameters.buyerInfoId The ID for the buyer info.
 * @param {Function} addJob helper to enqueue another job.
 * @returns {Response} The result of the operation.
 */
const createDataOrderFacade = async (
  {
    account,
    totalAccounts,
    notaries,
    buyerInfoId,
    batchId,
    filters,
    ...parameters
  },
  addJob,
) => {
  const { termsHash } = await getBuyerInfo(buyerInfoId);
  const params = buildDataOrderParameters({
    filters: [
      ...filters, {
        filter: 'ethAddress',
        values: {
          totalBuckets: totalAccounts,
          bucketNumber: account.number,
        },
      },
    ],
    ...parameters,
    termsAndConditions: termsHash,
  });

  if (params.buyerURL.length === 0) {
    return new Response(null, ['Field \'buyerURL\' must be a valid URL']);
  }

  if (params.termsAndConditions.length === 0) {
    return new Response(null, ['Field \'termsAndConditions\' is required']);
  }

  if (notaries.length === 0) {
    return new Response(null, ['Field \'notaries\' must contain at least one notary address']);
  }

  if (Number(params.initialBudgetForAudits) > 0) {
    await performTransaction(
      web3,
      account,
      signingService.signIncreaseApproval,
      {
        spender: dataExchange.address,
        addedValue: fromWib(params.initialBudgetForAudits),
      },
    );
  }

  const receipt = await sendTransaction(
    web3,
    account,
    signingService.signNewOrder,
    params,
    config.contracts.gasPrice.fast,
  );

  addJob('dataOrderSent', {
    receipt, account, notaries, buyerInfoId, batchId,
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
  account,
  notaries,
  buyerInfoId,
  batchId,
  addJob,
) => {
  const { logs } = await getTransactionReceipt(web3, receipt);
  const { orderAddr } = extractEventArguments(
    'NewOrder',
    logs,
    dataExchange,
  );

  addJob('addNotariesToOrder', { orderAddr, account, notaries });
  addJob('associateBuyerInfoToOrder', { orderAddr, buyerInfoId });
  addJob('associateOrderToBatch', { batchId, orderAddr });
};

export { createDataOrderFacade, onDataOrderSent };
