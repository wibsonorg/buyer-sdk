import Response from './Response';
import { extractEventArguments } from './helpers';
import { dataExchange } from '../utils';
import { priority } from '../queues';
import { getBuyerInfo } from '../services/buyerInfo';
import { coercion, coin } from '../utils/wibson-lib';
import config from '../../config';

const { toString } = coercion;
const { fromWib } = coin;

/**
 * @async
 * @param {Object} transaction Transaction hash.
 * @param {Array} notaries Ethereum addresses of the notaries involved.
 * @param {String} buyerInfoId The ID for the buyer info.
 * @param {Function} enqueueJob Function to add job to process.
 */
const onDataOrderCreated = async (
  account,
  batchId,
  transaction,
  notaries,
  buyerInfoId,
  enqueueJob,
) => {
  const { orderAddr } = extractEventArguments(
    'NewOrder',
    transaction.logs,
    dataExchange,
  );

  enqueueJob('addNotariesToOrder', {
    account: account.toLowerCase(),
    orderAddr: orderAddr.toLowerCase(),
    notaries,
  });

  enqueueJob('associateBuyerInfoToOrder', {
    orderAddr: orderAddr.toLowerCase(),
    buyerInfoId,
  });

  enqueueJob('associateOrderToBatch', {
    batchId, orderAddr,
  });
};

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
 * @param {String} parameters.notaries Notaries' ethereum addresses.
 * @returns {Object} Curated fields needed to create a DataOrder.
 */
const buildDataOrderParameters = ({
  filters,
  dataRequest,
  price,
  initialBudgetForAudits,
  termsAndConditions,
  buyerURL,
  notaries,
}) => ({
  filters: JSON.stringify(filters.reduce((accum, { filter, values }) =>
    ({ ...accum, [filter]: values }), {})),
  dataRequest: JSON.stringify(dataRequest),
  price: fromWib(price),
  initialBudgetForAudits: fromWib(initialBudgetForAudits),
  termsAndConditions: toString(termsAndConditions),
  buyerURL: JSON.stringify(buyerURL),
  notaries: notaries.map(notary => notary.toLowerCase()),
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
    buyerInfoId,
    batchId,
    filters,
    ...parameters
  },
  enqueueTransaction,
  enqueueJob,
) => {
  const { termsHash } = await getBuyerInfo(buyerInfoId);
  const { notaries, ...params } = buildDataOrderParameters({
    ...parameters,
    termsAndConditions: termsHash,
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

  const job = await enqueueTransaction(
    account,
    'NewOrder',
    params,
    config.contracts.gasPrice.fast,
    {
      priority: priority.MEDIUM,
    },
  );

  job.finished().then((transaction) => {
    if (transaction.status === 'success') {
      onDataOrderCreated(transaction, notaries, buyerInfoId, enqueueJob);
    }
  });

  return new Response({ status: 'pending' });
};

export { createDataOrderFacade };
