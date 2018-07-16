import {
  countObjects,
  listObjects,
  getObject,
  sendObject,
  buildPrefixWithTarget,
} from './s3Helpers';

const responsePrefix = 'response-';
const dataPrefix = 'data-';

const isSuitableForDataOrder = dataOrder => // eslint-disable-line no-unused-vars
  // TODO: change this when more storages are added and there is a way to know
  // if S3 is requested
  true;


const countDataResponses = dataOrder => countObjects(dataOrder, responsePrefix);

const listDataResponses = dataOrder => listObjects(dataOrder, responsePrefix);

const getDataResponse = (dataOrder, senderAccount) =>
  getObject(dataOrder, responsePrefix, senderAccount);

const sendDataResponse = (dataOrder, senderAccount, dataResponse) =>
  sendObject(dataOrder, responsePrefix, senderAccount, dataResponse);

const countData = (dataOrder, sentTo) => {
  const prefix = buildPrefixWithTarget(dataPrefix, sentTo);
  return countObjects(dataOrder, prefix);
};

const listData = (dataOrder, sentTo) => {
  const prefix = buildPrefixWithTarget(dataPrefix, sentTo);
  return listObjects(dataOrder, prefix);
};

const getData = (dataOrder, senderAccount, sentTo) => {
  const prefix = buildPrefixWithTarget(dataPrefix, sentTo);
  return getObject(dataOrder, prefix, senderAccount);
};

const sendData = (dataOrder, senderAccount, data, sendTo) => {
  const prefix = buildPrefixWithTarget(dataPrefix, sendTo);
  return sendObject(dataOrder, prefix, senderAccount, data);
};

export {
  isSuitableForDataOrder,
  countDataResponses,
  listDataResponses,
  getDataResponse,
  sendDataResponse,
  countData,
  listData,
  getData,
  sendData,
};
