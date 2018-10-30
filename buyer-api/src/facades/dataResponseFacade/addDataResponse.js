import web3 from '../../utils/web3';
import signingService from '../../services/signingService';
import { sendTransaction, retryAfterError } from '../helpers';
import { getDataResponse } from '../../utils/wibson-lib/s3';
import { dataExchange, dataOrderAt, wibcoin, logger } from '../../utils';
import config from '../../../config';

const getTotalPrice = async (myAddress, dataOrder, notaryAccount) => {
  const [
    priceStr,
    notaryInfo,
    remainingBudgetForAuditsStr,
  ] = await Promise.all([
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
  if (!web3.utils.isAddress(order) || !web3.utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = dataOrderAt(order);
  const sellerAccepted = await dataOrder.methods.hasSellerBeenAccepted(seller).call();

  if (sellerAccepted) {
    addDataResponseSent({
      receipt: null, // We don't have the receipt at this point
      orderAddress: order,
      sellerAddress: seller,
    });

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
  if (!(web3.utils.isAddress(notaryAccount) || dataHash || signature)) {
    throw new Error('Invalid data response payload');
  }

  const notaryAdded = await dataOrder.methods.hasNotaryBeenAdded(notaryAccount).call();
  if (!notaryAdded) {
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
