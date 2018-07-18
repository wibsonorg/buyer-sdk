import web3Utils from 'web3-utils';
import web3 from '../utils/web3';
import signingService from '../services/signingService';
import { getElements } from './helpers';
import { getDataResponse } from '../utils/wibson-lib/storages';
import { dataExchange, DataOrderContract } from '../utils';

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

  const { wasAudited, isDataValid, notarySignature } = { wasAudited: false, isDataValid: false, notarySignature: '' };

  const params = {
    orderAddr: order,
    seller,
    wasAudited,
    isDataValid,
    notarySignature,
  };

  const { address } = await signingService.getAccount();
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService.signCloseDataResponse({ nonce, params });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  await web3.eth.getTransactionReceipt(receipt);
  // TODO: Check receipt

  return true;
};

export { addDataResponse, closeDataResponse };
