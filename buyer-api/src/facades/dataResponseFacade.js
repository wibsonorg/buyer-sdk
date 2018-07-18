import web3Utils from 'web3-utils';
import client from 'request-promise-native';
import web3 from '../utils/web3';
import signingService from '../services/signingService';
import { getElements } from './helpers';
import { getDataResponse } from '../utils/wibson-lib/storages';
import { dataExchange, DataOrderContract } from '../utils';

const auditResult = async (notaryUrl, order, seller, buyer) => {
  const auditUrl = `${notaryUrl}/buyers/audit/result/${order}/${buyer}`;
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

const addDataResponse = async (order, seller) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = await DataOrderContract.at(order);

  if (dataOrder.hasSellerBeenAccepted(seller)) {
    throw new Error('Data Response has already been added');
  }

  let dataResponse;
  try {
    dataResponse = await getDataResponse(dataOrder, seller);
  } catch (err) {
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

  const params = {
    orderAddr: order,
    seller,
    notary: notaryAccount,
    dataHash,
    signature,
  };

  const { address } = await signingService.getAccount();
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService.signAddDataResponse({ nonce, params });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  await web3.eth.getTransactionReceipt(receipt);
  // TODO: Check receipt

  return true;
};

const closeDataResponse = async (order, seller) => {
  if (!web3Utils.isAddress(order) || !web3Utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = await DataOrderContract.at(order);

  const sellerInfo = dataOrder.getSellerInfo(seller);
  if (web3Utils.hexToUtf8(sellerInfo[5]) !== 'DataResponseAdded') {
    throw new Error('Data Response has already been closed|refunded');
  }

  const notaryAddress = sellerInfo[1];
  const notaryInfo = dataExchange.getNotaryInfo(notaryAddress);
  const notaryURL = notaryInfo[2];

  const params = await auditResult(notaryURL, order, seller, dataOrder.buyer());

  const { address } = await signingService.getAccount();
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService.signCloseDataResponse({ nonce, params });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  await web3.eth.getTransactionReceipt(receipt);
  // TODO: Check receipt

  return true;
};

export { addDataResponse, closeDataResponse };
