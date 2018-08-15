import web3Utils from 'web3-utils';
import client from 'request-promise-native';
import url from 'url';
import web3 from '../../utils/web3';
import signingService from '../../services/signingService';
import {
  getTransactionReceipt,
  sendTransaction,
  retryAfterError,
} from '../helpers';
import { getNotaryInfo } from '../notariesFacade';
import { dataExchange, DataOrderContract, logger } from '../../utils';

const auditResult = async (notaryUrl, order, seller, buyer) => {
  const auditUrl = url.resolve(notaryUrl, `/buyers/audit/result/${buyer}/${order}`);
  const payload = { dataResponses: [{ seller }] };
  const response = await client.post(auditUrl, { json: payload, timeout: 1000 });
  const res = response.dataResponses[0];

  if (res.result === 'in-progress') {
    throw new Error('Audit result is in progress');
  }

  const wasAudited = res.result === 'success' || res.result === 'failure';
  const isDataValid = res.result === 'success';
  const notarySignature = res.signature;

  return {
    orderAddr: order,
    seller,
    wasAudited,
    isDataValid,
    notarySignature,
  };
};

const closeDataResponse = async (order, seller, dataResponseQueue) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = DataOrderContract.at(order);

  const sellerInfo = await dataOrder.getSellerInfo(seller);
  if (web3Utils.hexToUtf8(sellerInfo[5]) !== 'DataResponseAdded') {
    return true; // DataResponse has already been closed.
  }

  const notaryAddress = sellerInfo[1];
  const notaryInfo = await getNotaryInfo(dataExchange, notaryAddress);
  const notaryApi = notaryInfo.publicUrls.api;

  const params = await auditResult(notaryApi, order, seller, dataOrder.buyer());

  const { address } = await signingService.getAccount();

  const receipt = await sendTransaction(
    web3,
    address,
    signingService.signCloseDataResponse,
    params,
  );

  dataResponseQueue.add('closeDataResponseSent', {
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

const onAddDataResponseSent = async (
  receipt,
  orderAddress,
  sellerAddress,
  dataResponseQueue,
) => {
  try {
    if (receipt) {
      await getTransactionReceipt(web3, receipt);
    }

    await closeDataResponse(orderAddress, sellerAddress, dataResponseQueue);
  } catch (error) {
    const { message } = error;

    if (!retryAfterError(error) || message === 'Invalid order|seller address') {
      logger.error('Could not close DataResponse (it will not be retried)' +
        ` | reason: ${error.message}` +
        ` | params ${JSON.stringify({ receipt, orderAddress, sellerAddress })}`);
    } else {
      throw error;
    }
  }
};

const onCloseDataResponseSent = async (
  receipt,
  orderAddress,
  sellerAddress,
) => {
  try {
    await getTransactionReceipt(web3, receipt);
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error('Close DataResponse failed (it will not be retried)' +
        ` | reason: ${error.message}` +
        ` | params ${JSON.stringify({ receipt, orderAddress, sellerAddress })}`);
    } else {
      throw error;
    }
  }
};

export {
  onAddDataResponseSent,
  closeDataResponse,
  onCloseDataResponseSent,
};
