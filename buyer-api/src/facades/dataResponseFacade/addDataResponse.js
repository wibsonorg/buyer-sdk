import web3Utils from 'web3-utils';
import signingService from '../../services/signingService';
import { sendTransaction, retryAfterError } from '../helpers';
import { getDataResponse } from '../../utils/wibson-lib/s3';
import {
  web3,
  dataExchange,
  wibcoin,
  DataOrderContract,
  logger,
} from '../../utils';
import config from '../../../config';

const getTotalPrice = async (myAddress, dataOrder, notaryAccount) => {
  const [
    priceStr,
    notaryInfo,
    remainingBudgetForAuditsStr,
  ] = await Promise.all([
    dataOrder.price(),
    dataOrder.getNotaryInfo(notaryAccount),
    dataExchange.buyerRemainingBudgetForAudits(myAddress, dataOrder.address),
  ]);
  const price = Number(priceStr);
  const notarizationFee = Number(notaryInfo[2]);
  const remainingBudgetForAudits = Number(remainingBudgetForAuditsStr);

  const prePaid = Math.min(notarizationFee, remainingBudgetForAudits);
  return price + (notarizationFee - prePaid);
};

const getAllowance = myAddress =>
  Number(wibcoin.allowance(myAddress, dataExchange.address));

const addDataResponse = async (order, seller, params, addDataResponseSent) => {
  const { address } = await signingService.getAccount();

  const receipt = await sendTransaction(
    web3,
    address,
    signingService.signAddDataResponse,
    params,
    config.contracts.gasPrice.fast,
  );

  addDataResponseSent({
    receipt,
    orderAddress: order,
    sellerAddress: seller,
  });

  return true;
};

const buyData = async (order, seller, addDataResponseSent) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = DataOrderContract.at(order);

  if (dataOrder.hasSellerBeenAccepted(seller)) {
    addDataResponseSent({
      receipt: null, // We don't have the receipt at this point
      orderAddress: order,
      sellerAddress: seller,
    });

    return true;
  }

  let dataResponse;
  try {
    dataResponse = await getDataResponse(dataOrder, seller);
  } catch (err) {
    logger.error(err);
    throw new Error('Could not retrieve data response from storage');
  }

  const { notaryAccount, dataHash, signature } = dataResponse;
  if (!(web3Utils.isAddress(notaryAccount) || dataHash || signature)) {
    throw new Error('Invalid data response payload');
  }

  if (!dataOrder.hasNotaryBeenAdded(notaryAccount)) {
    throw new Error('Invalid notary');
  }

  const { address } = await signingService.getAccount();
  const totalPrice = await getTotalPrice(address, dataOrder, notaryAccount);
  const allowance = await getAllowance(address);

  if (allowance < totalPrice) {
    throw new Error('Not enough allowance to add DataResponse');
  }

  return addDataResponse(order, seller, {
    orderAddr: order,
    seller,
    notary: notaryAccount,
    dataHash,
    signature,
  }, addDataResponseSent);
};

const onBuyData = async (orderAddress, sellerAddress, addDataResponseSent) => {
  try {
    await buyData(orderAddress, sellerAddress, addDataResponseSent);
  } catch (error) {
    const { message } = error;

    if (!retryAfterError(error)
      || message === 'Invalid order|seller address'
      || message === 'Invalid data response payload'
      || message === 'Invalid notary'
    ) {
      logger.error('Could not buy data (it will not be retried)' +
        ` | reason: ${error.message}` +
        ` | params ${JSON.stringify({ orderAddress, sellerAddress })}`);
    } else {
      throw error;
    }
  }
};

export {
  onBuyData,
  addDataResponse,
};
