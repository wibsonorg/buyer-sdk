import Response from './Response';
import { getNotariesInfo } from './notariesFacade';
import { extractEventArguments, performTransaction } from './helpers';
import signingService from '../services/signingService';
import notaryService from '../services/notaryService';
import web3 from '../utils/web3';
import logger from '../utils/logger';
import { coercion, collection } from '../utils/wibson-lib';

const { isPresent } = coercion;
const { partition } = collection;

const buildNotariesParameters = async (
  notaries,
  buyerAddress,
  orderAddress,
) => {
  const promises = notaries.map(async ({ notary, publicUrls: { api } }) => {
    const response = await notaryService
      .consent(api, { buyerAddress, orderAddress });

    return { ...response, notary };
  });

  return Promise.all(promises);
};

const addNotaryToOrder = async (notaryParameters, buyerAddress, contract) => {
  try {
    const { error, tx } = await performTransaction(
      web3,
      buyerAddress,
      signingService.signAddNotaryToOrder,
      notaryParameters,
    );

    if (error) {
      return { error, notaryParameters };
    }

    const { notary: notaryAddress } = extractEventArguments(
      'NotaryAddedToOrder',
      tx.logs,
      contract,
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
 * @param {Object} contract DataExchange contract
 * @returns {Response} The result of the operation.
 */
const addNotariesToOrderFacade = async (orderAddress, addresses, contract) => {
  const { address: buyerAddress } = await signingService.getAccount();
  const notariesInformation = await getNotariesInfo(contract, addresses);
  const notariesParameters = await buildNotariesParameters(
    notariesInformation,
    buyerAddress,
    orderAddress,
  );

  if (notariesParameters.length === 0) {
    return new Response(null, [
      'Field \'notaries\' should contain at least one item with notary info',
    ]);
  }

  let txs = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const notaryParameters of notariesParameters) {
    txs = [
      ...txs,
      // eslint-disable-next-line no-await-in-loop
      await addNotaryToOrder(notaryParameters, buyerAddress, contract),
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
