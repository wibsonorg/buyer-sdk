import SolidityEvent from 'web3/lib/web3/event';
import Response from './Response';
import signingService from '../services/signingService';
import web3 from '../utils/web3';
import logger from '../utils/logger';
import { coercion, collection } from '../utils/wibson-lib';

const { isPresent, toString, toInteger } = coercion;
const { partition } = collection;

const buildNotariesParameters = notaries =>
  notaries.map(({
    notary,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    notarySignature,
  }) => ({
    notary: toString(notary),
    responsesPercentage: toInteger(responsesPercentage),
    notarizationFee: toInteger(notarizationFee),
    notarizationTermsOfService: toString(notarizationTermsOfService),
    notarySignature: toString(notarySignature),
  }));

const parseLogs = (logs, abi) => {
  const decoders = abi
    .filter(({ type }) => type === 'event')
    .map(json => new SolidityEvent(null, json, null));

  return logs.reduce((accumulator, log) => {
    const found = decoders
      .find(decoder => decoder.signature() === log.topics[0].replace('0x', ''));

    if (found) {
      return [...accumulator, found.decode(log)];
    }

    return accumulator;
  }, []);
};

export const extractEventArguments = (eventName, logs, contract) => {
  const parsedLogs = parseLogs(logs, contract.abi);

  const { args } = parsedLogs.find(({ event }) => event === eventName);
  return args;
};

const addNotaryToOrder = async (orderAddr, notary, buyerAddress, contract) => {
  try {
    const nonce = await web3.eth.getTransactionCount(buyerAddress);
    const { signedTransaction } = await signingService.signAddNotaryToOrder({
      nonce,
      addNotaryToOrderParameters: { orderAddr, ...notary },
    });
    const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
    const { logs } = await web3.eth.getTransactionReceipt(receipt);

    const { notary: notaryAddress } = extractEventArguments(
      'NotaryAddedToOrder',
      logs,
      contract,
    );

    return { notaryAddress };
  } catch (error) {
    // TODO: treat each error type accordingly
    const errorPayload = {
      error: error.message,
      stack: error.stack,
      orderAddress: orderAddr,
      notary,
    };
    logger.error('Transaction failed', errorPayload);

    return errorPayload;
  }
};

/**
 * @async
 * @param {String} orderAddress Address of the DataOrder
 * @param {Array} notaries Information of the notaries to be added
 * @param {Object} contract DataExchange contract
 * @returns {Response} The result of the operation.
 */
const addNotariesToOrderFacade = async (orderAddress, notaries, contract) => {
  const notariesParameters = buildNotariesParameters(notaries);
  // check notarySignature to fail fast?
  if (notariesParameters.length === 0) {
    return new Response(null, [
      'Field \'notaries\' should contain at least one item with notary info',
    ]);
  }

  const { address } = await signingService.getAccount();
  let txs = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const notary of notariesParameters) {
    txs = [
      ...txs,
      // eslint-disable-next-line no-await-in-loop
      await addNotaryToOrder(orderAddress, notary, address, contract),
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
