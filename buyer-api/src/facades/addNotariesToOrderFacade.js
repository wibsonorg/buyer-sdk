import Response from './Response';
import { getNotariesInfo } from './notariesFacade';
import {
  getTransactionReceipt,
  sendTransaction,
  retryAfterError,
} from './helpers';
import { signingService, notaryService } from '../services';
import { logger, web3, DataOrderContract } from '../utils';
import { fromWib } from '../utils/wibson-lib/coin';
import config from '../../config';

const buildNotariesParameters = async (notaries, buyerAddr, orderAddr) => {
  const promises = notaries.map(async ({ notary, publicUrls: { api } }) => {
    const { notarizationFee, ...response } = await notaryService
      .consent(api, { buyerAddress: buyerAddr, orderAddress: orderAddr });

    return { ...response, notarizationFee: fromWib(notarizationFee), notary };
  });

  return Promise.all(promises);
};

/**
 * @param {String} orderAddress DataOrder's ethereum address
 * @param {Array} addresses Array of notary addresses
 * @returns {Response} The result of the operation.
 */
const takeOnlyNotariesToAdd = (orderAddress, addresses) => {
  const dataOrder = DataOrderContract.at(orderAddress);

  return addresses.reduce((accumulator, address) => {
    if (!dataOrder.hasNotaryBeenAdded(address)) {
      return [...accumulator, address];
    }
    return accumulator;
  }, []);
};

/**
 * @async
 * @param {Object} params Transaction parameters
 * @param {String} buyerAddress Buyer's ethereum address
 * @param {Function} addNotaryToOrderSent Callback to notify that tx's been sent
 * @throws {Error} when AddNotaryToOrder transaction can't be sent
 * @returns {Response} The result of the operation.
 */
const addNotaryToOrder = async (params, buyerAddress, addNotaryToOrderSent) => {
  try {
    const dataOrder = DataOrderContract.at(params.orderAddress);
    if (dataOrder.hasNotaryBeenAdded(params.notary)) {
      return;
    }

    const receipt = await sendTransaction(
      web3,
      buyerAddress,
      signingService.signAddNotaryToOrder,
      params,
      config.contracts.gasPrice.fast,
    );

    addNotaryToOrderSent({
      receipt,
      buyerAddress,
      orderAddress: params.orderAddress,
      notaryAddress: params.notary,
    });
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error('Could not add notary to order (it will not be retried)' +
        ` | reason: ${error.message}` +
        ` | params ${JSON.stringify(params)}`);
    } else {
      throw error;
    }
  }
};

/**
 * @async
 * @param {String} receipt Transaction hash
 * @param {String} orderAddress Order's ethereum address
 * @param {String} notaryAddress Notary's ethereum address
 * @param {String} buyerAddress Buyer's ethereum address
 * @throws {Error} when AddNotaryToOrder transaction is pending or fails
 */
const onAddNotaryToOrderSent = async (
  receipt,
  orderAddress,
  notaryAddress,
  buyerAddress,
) => {
  try {
    await getTransactionReceipt(web3, receipt);
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error('AddNotaryToOrder failed (it will not be retried) ' +
        `| reason: ${error.message} ` +
        `| params ${JSON.stringify({
          orderAddress, notaryAddress, buyerAddress,
        })}`);
    } else {
      throw error;
    }
  }
};

/**
 * @async
 * @param {String} orderAddress Address of the DataOrder
 * @param {Array} addresses Notaries' ethereum addresses
 * @param {Object} notariesCache Storage used for notaries caching
 * @param {Function} enqueueAddNotaryToOrder Callback to enqueue a job
 * @returns {Response} The result of the operation.
 */
const addNotariesToOrderFacade = async (
  orderAddress,
  addresses,
  notariesCache,
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

  const { address: buyerAddress } = await signingService.getAccount();
  const notariesInformation = await getNotariesInfo(notariesCache, notariesToAdd);
  const notariesParameters = await buildNotariesParameters(
    notariesInformation,
    buyerAddress,
    orderAddress,
  );

  notariesParameters.map(notaryParameters =>
    enqueueAddNotaryToOrder({ notaryParameters, buyerAddress }));

  return new Response({ status: 'pending' });
};

export { addNotariesToOrderFacade, addNotaryToOrder, onAddNotaryToOrderSent };
