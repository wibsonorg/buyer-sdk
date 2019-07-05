import getS3Client from './getS3Client';
import config from '../../../../config';

const prefix = 'buyer';
const { storage } = config;
const client = getS3Client(
  storage.url,
  storage.region,
  storage.bucket,
  storage.user,
  storage.password,
);

const getS3Object = async (objectName) => {
  const obj = await client.getObject(objectName);
  const data = obj.Body.toString();
  return JSON.parse(data);
};

const putS3Object = async (objectName, data) =>
  client.putObject(objectName, JSON.stringify(data));

const getS3Objects = async (namespace, justSnippets = false) => {
  const files = await client.listObjects(namespace);
  const objectsPromises = files.map(async (file) => {
    const fileName = file.Key;
    const payload = await (justSnippets ? file : getS3Object(fileName));

    return {
      fileName,
      payload,
    };
  });

  const objects = await Promise.all(objectsPromises);
  return objects.filter(obj => obj.payload);
};

// //

const countObjects = async (orderAddress, type) => {
  const namespace = `${prefix}/${orderAddress}/${type}/`;
  const objects = await getS3Objects(namespace, true);
  return objects.length;
};

const listObjects = (orderAddress, type) => {
  const namespace = `${prefix}/${orderAddress}/${type}/`;
  return getS3Objects(namespace);
};

const getObject = (orderAddress, seller, type) => {
  const name = `${prefix}/${orderAddress}/${type}/${seller}.json`;
  return getS3Object(name);
};

const putObject = (orderAddress, seller, type, data) => {
  const name = `${prefix}/${orderAddress}/${type}/${seller}.json`;
  return putS3Object(name, data);
};

const getOrderObject = (orderAddress, type) => {
  const name = `${prefix}/${orderAddress}/${type}.json`;
  return getS3Object(name);
};

const putOrderObject = (orderAddress, type, data) => {
  const name = `${prefix}/${orderAddress}/${type}.json`;
  return putS3Object(name, data);
};

// //

const countDataResponses = orderAddress => countObjects(orderAddress, 'data-responses');

const listDataResponses = orderAddress => listObjects(orderAddress, 'data-responses');

const getDataResponse = (orderAddress, seller) => getObject(orderAddress, seller, 'data-responses');

const countData = orderAddress => countObjects(orderAddress, 'data');

const listData = orderAddress => listObjects(orderAddress, 'data');

const getData = (orderAddress, seller) => getObject(orderAddress, seller, 'data');

const putData = (orderAddress, seller, data) => putObject(orderAddress, seller, 'data', data);

const putRawOrderData = (orderId, data) => putOrderObject(orderId, 'rawData', data);
const getRawOrderData = (orderId, data) => getOrderObject(orderId, 'rawData', data);

const getOrCreateRawOrderData = async (orderId) => {
  try {
    return getRawOrderData(orderId);
  } catch (e) {
    return putRawOrderData(orderId, {});
  }
};

export {
  countDataResponses,
  listDataResponses,
  getDataResponse,
  countData,
  listData,
  getData,
  getRawOrderData,
  getOrCreateRawOrderData,
  putData,
  putRawOrderData,
};
