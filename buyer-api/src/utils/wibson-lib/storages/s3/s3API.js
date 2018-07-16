import getS3Client from "./getS3Client";

const _getS3Object = async (client, bucket, objectName) => {
  const obj = await client.getObject(bucket, objectName);
  const data = obj.Body.toString();
  return JSON.parse(data);
};

const _getS3Objects = async (client, bucket, prefix, justSnippets) => {
  const files = await client.listObjects(bucket, prefix);
  const objectsPromises = files.map(async file => {
    const payload = await (justSnippets
      ? file
      : _getS3Object(client, bucket, file.Key));

    return {
      fileName: file.Key,
      payload
    };
  });

  const objects = await Promise.all(objectsPromises);
  return objects.filter(obj => obj.payload);
};

const _performOperation = (uri, bucket, operation) => {
  const client = getS3Client(uri);
  return client
    .bucketExists(bucket)
    .catch(() => client.makeBucket(bucket, "us-east-1"))
    .then(() => operation(client));
};

const getS3Object = (uri, bucket, objectName) =>
  _performOperation(uri, bucket, client =>
    _getS3Object(client, bucket, objectName)
  );

const getS3Objects = (uri, bucket, prefix, justSnippets) =>
  _performOperation(uri, bucket, client =>
    _getS3Objects(client, bucket, prefix, justSnippets)
  );

const putS3Object = (uri, bucket, objectName, object) =>
  _performOperation(uri, bucket, client =>
    client.putObject(bucket, objectName, object)
  );

export { getS3Object, getS3Objects, putS3Object };
