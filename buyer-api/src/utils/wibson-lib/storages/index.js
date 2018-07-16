import * as S3 from './s3';

const storages = [S3];

const checkTarget = (target) => {
  const exists = target === 'buyer' || target === 'notary';
  if (!exists) {
    throw new Error('Target not found');
  }
};

const getStorageForDataOrder = dataOrder =>
  storages.find(storage => storage.isSuitableForDataOrder(dataOrder));


const countDataResponses = async (dataOrder) => {
  const storage = getStorageForDataOrder(dataOrder);
  return storage.countDataResponses(dataOrder);
};

const listDataResponses = async (dataOrder) => {
  const storage = getStorageForDataOrder(dataOrder);
  return storage.listDataResponses(dataOrder);
};

const getDataResponse = async (dataOrder, senderAccount) => {
  const storage = getStorageForDataOrder(dataOrder);
  return storage.getDataResponse(dataOrder, senderAccount);
};

const sendDataResponse = async (dataOrder, senderAccount, dataResponse) => {
  const storage = getStorageForDataOrder(dataOrder);
  return storage.sendDataResponse(dataOrder, senderAccount, dataResponse);
};

const countData = async (dataOrder, sentTo) => {
  checkTarget(sentTo);
  const storage = getStorageForDataOrder(dataOrder);
  return storage.countData(dataOrder, sentTo);
};

const listData = async (dataOrder, sentTo) => {
  checkTarget(sentTo);
  const storage = getStorageForDataOrder(dataOrder);
  return storage.listData(dataOrder, sentTo);
};

const getData = async (dataOrder, senderAccount, sentTo) => {
  checkTarget(sentTo);
  const storage = getStorageForDataOrder(dataOrder);
  return storage.getData(dataOrder, senderAccount, sentTo);
};

const sendData = async (dataOrder, senderAccount, data, sendTo) => {
  checkTarget(sendTo);
  const storage = getStorageForDataOrder(dataOrder);
  return storage.sendData(dataOrder, senderAccount, data, sendTo);
};

export {
  countDataResponses,
  listDataResponses,
  getDataResponse,
  sendDataResponse,
  countData,
  listData,
  getData,
  sendData,
};
