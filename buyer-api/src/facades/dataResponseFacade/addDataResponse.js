import web3 from '../../utils/web3';
import signingService from '../../services/signingService';
import notaryService from '../../services/notaryService';
import { getDataResponse } from '../../utils/wibson-lib/s3';
import { dataExchange, dataOrderAt, wibcoin, logger } from '../../utils';
import { getNotaryInfo } from '../notariesFacade';
import config from '../../../config';

const getTotalPrice = async (myAddress, dataOrder, notaryAccount) => {
  const [priceStr, notaryInfo, remainingBudgetForAuditsStr] = await Promise.all([
    dataOrder.methods.price().call(),
    dataOrder.methods.getNotaryInfo(notaryAccount).call(),
    dataExchange.methods.buyerRemainingBudgetForAudits(myAddress, dataOrder.options.address).call(),
  ]);
  const price = Number(priceStr);
  const notarizationFee = Number(notaryInfo[2]);
  const remainingBudgetForAudits = Number(remainingBudgetForAuditsStr);

  const prePaid = Math.min(notarizationFee, remainingBudgetForAudits);
  return price + (notarizationFee - prePaid);
};

const getAllowance = async myAddress =>
  Number(await wibcoin.methods.allowance(myAddress, dataExchange.options.address).call());

// hack to avoid spending gas when trying to get scammed.
const freeRideNotarization = async (order, seller, notary, buyer) => {
  const notaryInfo = await getNotaryInfo(notary);
  const notaryApi = notaryInfo.publicUrls.api;

  await notaryService.demandAudit(notaryApi, order, seller, buyer, true);
  const { wasAudited, isDataValid } = await notaryService.auditResult(
    notaryApi,
    order,
    seller,
    buyer,
  );

  logger.info(`Notarization was done: ${wasAudited}. Result: ${isDataValid}`);

  if (wasAudited && !isDataValid) {
    throw new Error('Failed notarization');
  }
};

/**
 * @async
 * @param {String} order DataOrder's ethereum address
 * @param {String} seller Seller's ethereum address
 * @param {Function} enqueueTransaction function to enqueue a transaction
 */
const addDataResponse = async (order, seller, enqueueTransaction) => {
  if (!web3.utils.isAddress(order) || !web3.utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = dataOrderAt(order);
  const sellerAccepted = await dataOrder.methods.hasSellerBeenAccepted(seller).call();

  if (sellerAccepted) {
    return true;
  }

  let dataResponse;
  try {
    dataResponse = await getDataResponse(dataOrder.options.address, seller);
  } catch (err) {
    logger.error(err);
    throw new Error('Could not retrieve data response from storage');
  }

  const { notaryAccount, dataHash, signature } = dataResponse;
  if (!(web3.utils.isAddress(notaryAccount) && dataHash && signature)) {
    throw new Error('Invalid data response payload');
  }

  const notaryAdded = await dataOrder.methods.hasNotaryBeenAdded(notaryAccount).call();
  if (!notaryAdded) {
    throw new Error('Invalid notary');
  }

  const account = await signingService.getAccount();
  const totalPrice = await getTotalPrice(account.address, dataOrder, notaryAccount);
  const allowance = await getAllowance(account.address);

  if (allowance < totalPrice) {
    throw new Error('Not enough allowance to add DataResponse');
  }

  // hack to avoid spending gas when trying to get scammed.
  await freeRideNotarization(order, seller, notaryAccount, account.address);

  enqueueTransaction(
    account,
    'AddDataResponse',
    {
      orderAddr: order,
      seller,
      notary: notaryAccount,
      dataHash,
      signature,
    },
    config.contracts.gasPrice.fast,
  );

  return true;
};

const onBuyData = async (orderAddress, sellerAddress, enqueueTx) => {
  try {
    await addDataResponse(orderAddress, sellerAddress, enqueueTx);
  } catch (error) {
    const { message } = error;

    if (
      message === 'Invalid order|seller address' ||
      message === 'Invalid data response payload' ||
      message === 'Invalid notary' ||
      message === 'Failed notarization'
    ) {
      logger.error('Could not buy data (it will not be retried)' +
          ` | reason: ${error.message}` +
          ` | params ${JSON.stringify({ orderAddress, sellerAddress })}`);
    } else {
      throw error;
    }
  }
};

export { onBuyData, addDataResponse };
