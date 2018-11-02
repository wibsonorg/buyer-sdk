import Response from './Response';
import { getNotariesInfo } from './notariesFacade';
import { notaryService } from '../services';
import { dataOrderAt } from '../utils';
import { priority } from '../queues';
import { fromWib } from '../utils/wibson-lib/coin';
import config from '../../config';

const fetchNotariesParameters = async (
  notaries,
  buyerAddress,
  orderAddress,
) => {
  const promises = notaries.map(async ({ notary, publicUrls: { api } }) => {
    const { notarizationFee, ...response } = await notaryService
      .consent(api, { buyerAddress, orderAddress });

    return { ...response, notarizationFee: fromWib(notarizationFee), notary };
  });

  return Promise.all(promises);
};

const takeOnlyNotariesToAdd = async (orderAddress, addresses) => {
  const dataOrder = dataOrderAt(orderAddress);

  let notariesNotAdded = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const address of addresses) {
    // eslint-disable-next-line no-await-in-loop
    const added = await dataOrder.methods.hasNotaryBeenAdded(address).call();

    if (!added) {
      notariesNotAdded = [...notariesNotAdded, address];
    }
  }

  return notariesNotAdded;
};

/**
 * @async
 * @param {String} account Buyer account
 * @param {String} params.orderAddr DataOrder's ethereum address
 * @param {String} params.responsesPercentage Percentage of response to notarize
 * @param {String} params.notarizationFee Notary's fee
 * @param {String} params.notarizationTermsOfService Notary's ToS
 * @param {String} params.notarySignature Notary's consent signature
 * @param {Function} enqueueTransaction function to enqueue a transaction
 * @throws {Error} when AddNotaryToOrder transaction can't be sent
 * @returns {Response} The result of the operation.
 */
const addNotaryToOrder = async (account, params, enqueueTransaction) => {
  const dataOrder = dataOrderAt(params.orderAddr);
  const notaryAdded = await dataOrder.methods.hasNotaryBeenAdded(params.notary).call();
  if (notaryAdded) {
    return;
  }

  enqueueTransaction(
    account,
    'AddNotaryToOrder',
    params,
    config.contracts.gasPrice.fast,
    { priority: priority.MEDIUM },
  );
};

/**
 * @async
 * @param {String} orderAddress Address of the DataOrder
 * @param {Array} addresses Notaries' ethereum addresses
 * @param {Function} enqueueAddNotaryToOrder Callback to enqueue a job
 * @returns {Response} The result of the operation.
 */
const addNotariesToOrderFacade = async (
  orderAddress,
  buyerAccount,
  addresses,
  enqueueAddNotaryToOrder,
) => {
  if (addresses.length === 0) {
    return new Response(null, [
      'Field \'notaries\' must contain at least one notary address',
    ]);
  }

  const notariesToAdd = await takeOnlyNotariesToAdd(orderAddress, addresses);

  if (notariesToAdd.length === 0) {
    // Don't fail, all notaries have been added
    return new Response({ status: 'done' });
  }

  const notariesInformation = await getNotariesInfo(notariesToAdd);
  const notariesParameters = await fetchNotariesParameters(
    notariesInformation,
    buyerAccount.address,
    orderAddress,
  );

  notariesParameters.map(notaryParameters =>
    enqueueAddNotaryToOrder({ account: buyerAccount, notaryParameters }));

  return new Response({ status: 'pending' });
};

export { addNotariesToOrderFacade, addNotaryToOrder };
