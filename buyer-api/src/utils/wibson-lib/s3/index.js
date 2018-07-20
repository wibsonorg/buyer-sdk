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

const countObjects = (dataOrder, type) => {
  const namespace = `${prefix}/${dataOrder.address}/${type}/`;
  const objects = getS3Objects(namespace, true);
  return objects.length;
};

const listObjects = (dataOrder, type) => {
  const namespace = `${prefix}/${dataOrder.address}/${type}/`;
  return getS3Objects(namespace);
};

const getObject = (dataOrder, seller, type) => {
  const name = `${prefix}/${dataOrder.address}/${type}/${seller}.json`;
  return getS3Object(name);
};


// //

const countDataResponses = dataOrder => countObjects(dataOrder, 'data-responses');

const listDataResponses = dataOrder => listObjects(dataOrder, 'data-responses');

const getDataResponse = (dataOrder, seller) => getObject(dataOrder, seller, 'data-responses');

const countData = dataOrder => countObjects(dataOrder, 'data');

const listData = dataOrder => listObjects(dataOrder, 'data');

const getData = (dataOrder, seller) => getObject(dataOrder, seller, 'data');

export {
  countDataResponses,
  listDataResponses,
  getDataResponse,
  countData,
  listData,
  getData,
};
