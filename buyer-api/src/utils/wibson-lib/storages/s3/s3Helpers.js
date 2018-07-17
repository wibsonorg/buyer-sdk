import { getS3Object, getS3Objects, putS3Object } from './s3API';
import config from '../../../../../config';

const { storageUrl } = config;

const countObjects = async (dataOrder, prefix) => {
  const objects = await getS3Objects(storageUrl, dataOrder.address, prefix, true);
  return objects.length;
};

const listObjects = (dataOrder, prefix) => {
  return getS3Objects(storageUrl, dataOrder.address, prefix, false);
};

const getObject = (dataOrder, prefix, senderAccount) => {
  return getS3Object(storageUrl, dataOrder.address, `${prefix}${senderAccount}.json`);
};

const sendObject = (dataOrder, prefix, senderAccount, obj) => {
  const filename = `${prefix}${senderAccount}.json`;
  const stringObject = JSON.stringify(obj);

  return putS3Object(storageUrl, dataOrder.address, filename, stringObject);
};

const buildPrefixWithTarget = (prefix, target) => `${prefix}${target}-`;

export { countObjects, listObjects, getObject, sendObject, buildPrefixWithTarget };
