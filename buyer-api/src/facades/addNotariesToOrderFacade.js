import SolidityEvent from 'web3/lib/web3/event';
import Response from './Response';
import signingService from '../services/signingService';
import web3 from '../utils/web3';
import logger from '../utils/logger';

const isPresent = v => v !== null && v !== undefined;

const toString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value.toString === 'function') return value.toString();
  return '';
};

const toInteger = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  return parseInt(value, 10);
};

const partition = (collection, partitionFunc) => {
  let left = [];
  let right = [];

  collection.forEach((item) => {
    if (partitionFunc(item)) {
      left = [...left, item];
    } else {
      right = [...right, item];
    }
  });

  return [left, right];
};

const buildNotariesParameters = notaries =>
  notaries.map(({
    notaryAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    notarySignature,
  }) => ({
    notaryAddress: toString(notaryAddress),
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

const addNotaryToOrder = async (
  orderAddress,
  notary,
  buyerAddress,
  contract,
) => {
  try {
    const nonce = await web3.eth.getTransactionCount(buyerAddress);
    const { signedTransaction } = await signingService.signAddNotaryToOrder({
      nonce,
      addNotaryToOrderParameters: {
        orderAddress,
        ...notary,
      },
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
    // TODO: treat each error type
    const errorPayload = { error, orderAddress, notary };
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
  const promises = notariesParameters.map(notary =>
    addNotaryToOrder(orderAddress, notary, address, contract));
  const txs = await Promise.all(promises);

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
