import getS3Client from './getS3Client';

const doGetS3Object = async (client, bucket, objectName) => {
  const obj = await client.getObject(bucket, objectName);
  const data = obj.Body.toString();
  return JSON.parse(data);
};

const doGetS3Objects = async (client, bucket, prefix, justSnippets) => {
  const files = await client.listObjects(bucket, prefix);
  const objectsPromises = files.map(async (file) => {
    const payload = await (justSnippets ? file : doGetS3Object(client, bucket, file.Key));

    return {
      fileName: file.Key,
      payload,
    };
  });

  const objects = await Promise.all(objectsPromises);
  return objects.filter(obj => obj.payload);
};

const performOperation = (uri, bucket, operation) => {
  const client = getS3Client(uri);
  return client
    .bucketExists(bucket)
    .catch(() => client.makeBucket(bucket, 'us-east-1'))
    .then(() => operation(client));
};

const getS3Object = (uri, bucket, objectName) =>
  performOperation(uri, bucket, client => doGetS3Object(client, bucket, objectName));

const getS3Objects = (uri, bucket, prefix, justSnippets) =>
  performOperation(uri, bucket, client => doGetS3Objects(client, bucket, prefix, justSnippets));

const putS3Object = (uri, bucket, objectName, object) =>
  performOperation(uri, bucket, client => client.putObject(bucket, objectName, object));

export { getS3Object, getS3Objects, putS3Object };
