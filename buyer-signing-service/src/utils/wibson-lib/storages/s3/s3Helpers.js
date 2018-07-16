import { getS3Object, getS3Objects, putS3Object } from './s3API';

const getStorageUrl = dataOrder => dataOrder.buyerPublicURL.storage;

const countObjects = async (dataOrder, prefix) => {
  const storageUrl = getStorageUrl(dataOrder);
  const objects = await getS3Objects(storageUrl, dataOrder.orderAddress, prefix, true);
  return objects.length;
};

const listObjects = (dataOrder, prefix) => {
  const storageUrl = getStorageUrl(dataOrder);
  return getS3Objects(storageUrl, dataOrder.orderAddress, prefix, false);
};

const getObject = (dataOrder, prefix, senderAccount) => {
  const storageUrl = getStorageUrl(dataOrder);
  return getS3Object(storageUrl, dataOrder.orderAddress, `${prefix}${senderAccount}.json`);
};

const sendObject = (dataOrder, prefix, senderAccount, obj) => {
  const filename = `${prefix}${senderAccount}.json`;
  const stringObject = JSON.stringify(obj);
  const storageUrl = getStorageUrl(dataOrder);

  return putS3Object(storageUrl, dataOrder.orderAddress, filename, stringObject);
};

const buildPrefixWithTarget = (prefix, target) => `${prefix}${target}-`;

export { countObjects, listObjects, getObject, sendObject, buildPrefixWithTarget };
