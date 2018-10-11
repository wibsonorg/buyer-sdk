import web3Utils from 'web3-utils';
import client from 'request-promise-native';
import signingService from '../../services/signingService';
import {
  getTransactionReceipt,
  sendTransaction,
  retryAfterError,
} from '../helpers';
import { getNotaryInfo } from '../notariesFacade';
import { web3, DataOrderContract, logger } from '../../utils';
import config from '../../../config';

const buildUri = (rootUrl, path) => {
  const baseUri = rootUrl.replace(/\/$/, '');
  const trimmedPath = path.replace(/^\//, '');
  return `${baseUri}/${trimmedPath}`;
};

const postAudit = async (notaryUrl, order, seller, buyer, step) => {
  const auditUrl = buildUri(notaryUrl, `buyers/audit/${step}/${buyer}/${order}`);
  const payload = { dataResponses: [{ seller }] };
  const response = await client.post(auditUrl, { json: payload, timeout: 1000 });
  return response.dataResponses[0];
};

const demandAudit = async (notaryUrl, order, seller, buyer) => {
  const { error } = await postAudit(notaryUrl, order, seller, buyer, 'on-demand');
  if (error) {
    throw new Error(error);
  }
};

const auditResult = async (notaryUrl, order, seller, buyer) => {
  const { error, result, signature } = await postAudit(notaryUrl, order, seller, buyer, 'result');

  if (error) {
    throw new Error(error);
  }

  if (result === 'in-progress') {
    throw new Error('Audit result is in progress');
  }

  const wasAudited = result === 'success' || result === 'failure';
  const isDataValid = result === 'success';
  const notarySignature = signature;

  return {
    orderAddr: order,
    seller,
    wasAudited,
    isDataValid,
    notarySignature,
  };
};

const closeDataResponse = async (order, seller, notariesCache, dataResponseQueue) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = DataOrderContract.at(order);

  const sellerInfo = await dataOrder.getSellerInfo(seller);
  if (web3Utils.hexToUtf8(sellerInfo[5]) !== 'DataResponseAdded') {
    return true; // DataResponse has already been closed.
  }

  const notaryAddress = sellerInfo[1];
  const notaryInfo = await getNotaryInfo(notaryAddress, notariesCache);
  const notaryApi = notaryInfo.publicUrls.api;

  const buyer = dataOrder.buyer();
  await demandAudit(notaryApi, order, seller, buyer);
  const params = await auditResult(notaryApi, order, seller, buyer);

  const { address } = await signingService.getAccount();

  const receipt = await sendTransaction(
    web3,
    address,
    signingService.signCloseDataResponse,
    params,
    config.contracts.gasPrice.fast,
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
  notariesCache,
  dataResponseQueue,
) => {
  try {
    if (receipt) {
      await getTransactionReceipt(web3, receipt);
    }

    await closeDataResponse(
      orderAddress,
      sellerAddress,
      notariesCache,
      dataResponseQueue,
    );
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
