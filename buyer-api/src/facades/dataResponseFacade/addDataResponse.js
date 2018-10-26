import web3 from '../../utils/web3';
import signingService from '../../services/signingService';
import { getTransactionReceipt, sendTransaction, retryAfterError } from '../helpers';
import { getDataResponse } from '../../utils/wibson-lib/s3';
import { dataExchange, dataOrderAt, logger } from '../../utils';
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

const buyData = async (order, seller, dataResponseQueue) => {
  if (!web3.utils.isAddress(order) || !web3.utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = dataOrderAt(order);
  const sellerAccepted = await dataOrder.methods.hasSellerBeenAccepted(seller).call();

  if (sellerAccepted) {
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

  const increaseApprovalReceipt = await sendTransaction(
    web3,
    address,
    signingService.signIncreaseApproval,
    {
      spender: dataExchange.options.address,
      addedValue: totalPrice,
    },
    config.contracts.gasPrice.fast,
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
  const { address } = await signingService.getAccount();

  const receipt = await sendTransaction(
    web3,
    address,
    signingService.signAddDataResponse,
    params,
    config.contracts.gasPrice.fast,
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
