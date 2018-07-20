import web3Utils from 'web3-utils';
import client from 'request-promise-native';
import url from 'url';
import web3 from '../utils/web3';
import signingService from '../services/signingService';
import { getElements } from './helpers/blockchain';
import { getNotaryInfo } from './notariesFacade';
import { getDataResponse } from '../utils/wibson-lib/s3';
import { dataExchange, DataOrderContract, logger } from '../utils';

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

const performTransaction = async (address, signingServiceMethod, params) => {
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService[signingServiceMethod]({ nonce, ...params });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  return web3.eth.getTransactionReceipt(receipt);
};

const getTotalPrice = async (myAddress, dataOrder, notaryAccount) => {
  const [price, notaryInfo, remainingBudgetForAudits] = await Promise.all([
    dataOrder.price(),
    dataOrder.getNotaryInfo(notaryAccount),
    dataExchange.buyerRemainingBudgetForAudits(myAddress, dataOrder.address),
  ]);
  const notarizationFee = notaryInfo[2];
  const prePaid = Math.min(notarizationFee, remainingBudgetForAudits);
  return price + (notarizationFee - prePaid); // without parenthesis, eslint complains
};

const addDataResponse = async (order, seller) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = DataOrderContract.at(order);

  if (dataOrder.hasSellerBeenAccepted(seller)) {
    throw new Error('Data Response has already been added');
  }

  let dataResponse;
  try {
    dataResponse = await getDataResponse(dataOrder, seller);
  } catch (err) {
    logger.debug(err);
    throw new Error('Could not retrieve data response from storage');
  }

  const { notaryAccount, dataHash, signature } = dataResponse;
  if (!(web3Utils.isAddress(notaryAccount) || dataHash || signature)) {
    throw new Error('Invalid data response payload');
  }

  const dataOrderNotaries = await getElements(dataOrder, 'notaries');
  if (!dataOrderNotaries.includes(notaryAccount)) {
    throw new Error('Invalid notary');
  }

  const { address } = await signingService.getAccount();

  const totalPrice = await getTotalPrice(address, dataOrder, notaryAccount);

  await performTransaction(address, 'signIncreaseApproval', {
    target: dataExchange.address,
    value: totalPrice,
  });

  const params = {
    orderAddr: order,
    seller,
    notary: notaryAccount,
    dataHash,
    signature,
  };

  await performTransaction(address, 'signAddDataResponse', { params });
  // TODO: Check receipt

  logger.debug('Data Response Added', { order, seller });
  return true;
};

const closeDataResponse = async (order, seller) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = DataOrderContract.at(order);

  const sellerInfo = await dataOrder.getSellerInfo(seller);
  if (web3Utils.hexToUtf8(sellerInfo[5]) !== 'DataResponseAdded') {
    throw new Error('Data Response has already been closed|refunded');
  }

  const notaryAddress = sellerInfo[1];
  const notaryInfo = await getNotaryInfo(web3, dataExchange, notaryAddress);
  const notaryApi = notaryInfo.publicUrls.api;

  const params = await auditResult(notaryApi, order, seller, dataOrder.buyer());

  const { address } = await signingService.getAccount();
  await performTransaction(address, 'signCloseDataResponse', { params });
  // TODO: Check receipt

  logger.debug('Data Response Closed', { order, seller });
  return true;
};

export { addDataResponse, closeDataResponse };
