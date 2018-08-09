import Response from './Response';
import { getNotariesInfo } from './notariesFacade';
import { extractEventArguments } from './helpers';
import signingService from '../services/signingService';
import notaryService from '../services/notaryService';
import web3 from '../utils/web3';
import { logger, dataExchange } from '../utils';
import { coercion, collection } from '../utils/wibson-lib';

const { isPresent } = coercion;
const { partition } = collection;

const buildNotariesParameters = async (notaries, buyerAddress, orderAddress) => {
  const promises = notaries.map(async ({ notary, publicUrls: { api } }) => {
    const response = await notaryService.consent(api, { buyerAddress, orderAddress });

    return { ...response, notary };
  });

  return Promise.all(promises);
};

const addNotaryToOrder = async (notaryParameters, buyerAddress) => {
  try {
    const nonce = await web3.eth.getTransactionCount(buyerAddress);
    const { signedTransaction } = await signingService.signAddNotaryToOrder({
      nonce,
      addNotaryToOrderParameters: notaryParameters,
    });
    const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
    const { logs } = await web3.eth.getTransactionReceipt(receipt);

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
 * @param {Object} contract DataExchange contract
 * @returns {Response} The result of the operation.
 */
const addNotariesToOrderFacade = async (orderAddress, addresses, notariesCache) => {
  const { address: buyerAddress } = await signingService.getAccount();
  const notariesInformation = await getNotariesInfo(notariesCache, addresses);
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
      await addNotaryToOrder(notaryParameters, buyerAddress),
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
