import web3Utils from 'web3-utils';
import web3 from '../../utils/web3';
import signingService from '../../services/signingService';
import {
  getTransactionReceipt,
  sendTransaction,
  retryAfterError,
  getBuyerAccount,
} from '../helpers';
import { getDataResponse } from '../../utils/wibson-lib/s3';
import { dataExchange, DataOrderContract, logger } from '../../utils';

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

const buyData = async (order, seller, dataResponseQueue) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = DataOrderContract.at(order);

  if (dataOrder.hasSellerBeenAccepted(seller)) {
    dataResponseQueue.add('addDataResponseSent', {
      receipt: null, // We don't have the receipt at this point
      orderAddress: order,
      sellerAddress: seller,
    }, {
      attempts: 20,
      backoff: {
        type: 'linear',
      },
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

  const buyerAccount = await getBuyerAccount(dataOrder);

  const totalPrice = await getTotalPrice(buyerAccount.address, dataOrder, notaryAccount);

  const increaseApprovalReceipt = await sendTransaction(
    web3,
    buyerAccount,
    signingService.signIncreaseApproval,
    {
      spender: dataExchange.address,
      addedValue: totalPrice,
    },
  );

  dataResponseQueue.add('increaseApprovalSent', {
    receipt: increaseApprovalReceipt,
    orderAddress: order,
    sellerAddress: seller,
    addDataResponseParams: {
      orderAddr: order,
      seller,
      notary: notaryAccount,
      dataHash,
      signature,
    },
  }, {
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });

  return true;
};

const addDataResponse = async (order, seller, params, dataResponseQueue) => {
  const buyerAccount = await getBuyerAccount(DataOrderContract.at(order));

  const receipt = await sendTransaction(
    web3,
    buyerAccount,
    signingService.signAddDataResponse,
    params,
  );

  dataResponseQueue.add('addDataResponseSent', {
    receipt,
    orderAddress: order,
    sellerAddress: seller,
  }, {
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });

  return true;
};

const onBuyData = async (orderAddress, sellerAddress, dataResponseQueue) => {
  try {
    await buyData(orderAddress, sellerAddress, dataResponseQueue);
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

const onIncreaseApprovalSent = async (
  increaseApprovalReceipt,
  orderAddress,
  sellerAddress,
  addDataResponseParams,
  dataResponseQueue,
) => {
  try {
    if (increaseApprovalReceipt) {
      await getTransactionReceipt(web3, increaseApprovalReceipt);
    }

    await addDataResponse(
      orderAddress,
      sellerAddress,
      addDataResponseParams,
      dataResponseQueue,
    );
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error('Could not add DataResponse (it will not be retried)' +
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
  onIncreaseApprovalSent,
};
