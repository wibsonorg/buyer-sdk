import aws from 'aws-sdk';

class AWSWrapper {
  constructor(bucket, s3) {
    this.bucket = bucket;
    this.s3 = s3;
  }

  promisify(methodName, params) {
    return new Promise((res, rej) =>
      this.s3[methodName](
        { Bucket: this.bucket, ...params },
        (err, data) => (err ? rej : res)(err || data),
      ));
  }

  getObject(key) {
    return this.promisify('getObject', { Key: key.toLowerCase() });
  }
  putObject(key, obj) {
    return this.promisify('putObject', { Key: key.toLowerCase(), Body: obj });
  }

  async listObjects(prefix) {
    const objects = [];
    let ContinuationToken;
    do {
      const params = { Prefix: prefix.toLowerCase(), ContinuationToken };
      const batch = await this.promisify('listObjectsV2', params); // eslint-disable-line no-await-in-loop
      objects.push(...batch.Contents);
      ContinuationToken = batch.IsTruncated && batch.NextContinuationToken;
    } while (ContinuationToken);
    return objects;
  }
}

const getS3Client = (uri, region, bucket, accessKeyId, secretAccessKey) => {
  if (!uri) throw new Error('A URI is required');
  if (!region) throw new Error('A Region is required');
  if (!bucket) throw new Error('A Bucket is required');

  return new AWSWrapper(bucket, new aws.S3({
    accessKeyId,
    secretAccessKey,
    region,
    s3ForcePathStyle: true,
  }));
};

export default getS3Client;
