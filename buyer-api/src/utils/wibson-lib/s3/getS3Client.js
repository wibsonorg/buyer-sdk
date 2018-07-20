import aws from 'aws-sdk';
import url from 'url';

class AWSWrapper {
  constructor(s3, bucket) {
    this.s3 = s3;
    this.bucket = bucket;
  }

  promisifyMethod(methodName, params) {
    return new Promise((resolve, reject) => {
      this.s3[methodName](params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  putObject(objectName, object) {
    const params = {
      Body: object,
      Bucket: this.bucket,
      Key: objectName,
    };
    return this.promisifyMethod('putObject', params);
  }

  getObject(objectName) {
    const params = {
      Bucket: this.bucket,
      Key: objectName,
    };
    return this.promisifyMethod('getObject', params);
  }

  async listObjects(prefix) {
    let objects = [];
    let isTruncated = true;
    let continuationToken;

    while (isTruncated) {
      const params = {
        Bucket: this.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      };
      const batch = await this.promisifyMethod('listObjectsV2', params);
      objects = [...objects, ...batch.Contents];
      isTruncated = batch.IsTruncated;
      continuationToken = batch.NextContinuationToken;
    }
    return objects;
  }
}

const getS3Client = (uri, region) => {
  if (!uri) throw new Error('A URI is required');
  if (!region) throw new Error('A Region is required');

  const location = url.parse(uri);
  const [accessKeyId, secretAccessKey] = location.auth ? location.auth.split(':') : [];

  const client = new aws.S3({
    accessKeyId,
    secretAccessKey,
    region,
    s3ForcePathStyle: true,
  });

  return new AWSWrapper(client, location.host);
};

export default getS3Client;
