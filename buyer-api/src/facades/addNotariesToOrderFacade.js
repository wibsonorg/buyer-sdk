import Response from './Response';
import { getNotariesInfo } from './notariesFacade';
import { extractEventArguments, performTransaction } from './helpers';
import signingService from '../services/signingService';
import notaryService from '../services/notaryService';
import { logger, web3, dataExchange, DataOrderContract } from '../utils';
import { coercion, coin, collection } from '../utils/wibson-lib';

const { isPresent } = coercion;
const { fromWib } = coin;
const { partition } = collection;

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
  const dataOrder = DataOrderContract.at(orderAddress);

  let notariesNotAdded = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const address of addresses) {
    // eslint-disable-next-line no-await-in-loop
    const added = await dataOrder.hasNotaryBeenAdded(address);

    if (!added) {
      notariesNotAdded = [...notariesNotAdded, address];
    }
  }

  return notariesNotAdded;
};

const addNotaryToOrder = async (notaryParameters, buyerAccount) => {
  try {
    const { logs } = await performTransaction(
      web3,
      buyerAccount,
      signingService.signAddNotaryToOrder,
      notaryParameters,
    );

    const { notary: notaryAddress } = extractEventArguments(
      'NotaryAddedToOrder',
      logs,
      dataExchange,
    );

    return { notaryAddress };
  } catch (error) { // TODO: treat each error type accordingly
    const errorPayload = { error: error.message, notaryParameters };
    logger.error('Transaction failed', errorPayload);

    return errorPayload;
  }
};

/**
 * @async
 * @param {String} orderAddress Address of the DataOrder
 * @param {Array} addresses Notaries' addresses
 * @returns {Response} The result of the operation.
 */
const addNotariesToOrderFacade = async (orderAddress, buyerAccount, addresses, notariesCache) => {
  if (addresses.length === 0) {
    return new Response(null, ['Field \'notaries\' must contain at least one notary address']);
  }

  const notariesToAdd = await takeOnlyNotariesToAdd(orderAddress, addresses);

  if (notariesToAdd.length === 0) {
    // Don't fail, all notaries have been added
    return new Response({
      orderAddress,
      notariesAddresses: addresses,
    });
  }

  const notariesInformation = await getNotariesInfo(notariesCache, notariesToAdd);
  const notariesParameters = await fetchNotariesParameters(
    notariesInformation,
    buyerAccount.address,
    orderAddress,
  );

  let txs = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const notaryParameters of notariesParameters) {
    txs = [
      ...txs,
      // eslint-disable-next-line no-await-in-loop
      await addNotaryToOrder(notaryParameters, buyerAccount),
    ];
  }

  const [
    failedTxs,
    successTxs,
  ] = partition(txs, ({ error }) => isPresent(error));
  const notariesAddresses = successTxs.map(({ notaryAddress }) => notaryAddress);

  if (failedTxs.length > 0) {
    return new Response(null, failedTxs);
  }

  return new Response({
    orderAddress,
    notariesAddresses,
  });
};

export default addNotariesToOrderFacade;
