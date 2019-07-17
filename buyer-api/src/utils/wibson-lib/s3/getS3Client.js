import aws from 'aws-sdk';

class AWSWrapper {
  constructor(bucket, s3) {
    this.bucket = bucket;
    this.s3 = s3;
  }

  promisify(methodName, params) {
    return new Promise((res, rej) =>
      this.s3[methodName]({ Bucket: this.bucket, ...params }, (err, data) =>
        (err ? rej : res)(err || data)));
  }

  getObject(key) {
    return this.promisify('getObject', { Key: key.toLowerCase() })
      .catch(() => this.promisify('getObject', { Key: key })); // making it retrocompatible
  }

  putObject(key, obj) {
    return this.promisify('putObject', { Key: key.toLowerCase(), Body: obj });
  }

  async listObjectsAsIs(prefix) {
    const objects = [];
    let ContinuationToken;
    do {
      const params = { Prefix: prefix, ContinuationToken };
      const batch = await this.promisify('listObjectsV2', params); // eslint-disable-line no-await-in-loop
      objects.push(...batch.Contents);
      ContinuationToken = batch.IsTruncated && batch.NextContinuationToken;
    } while (ContinuationToken);
    return objects;
  }

  async listObjects(prefix) { // making it retrocompatible
    const lowerCaseObjects = await this.listObjectsAsIs(prefix.toLowerCase());
    const objects = await this.listObjectsAsIs(prefix);
    return [...lowerCaseObjects, ...objects];
  }
}

export const getS3Client = storage => new AWSWrapper(
  storage.bucket,
  new aws.S3({
    region: storage.region,
    accessKeyId: storage.user,
    secretAccessKey: storage.password,
    s3ForcePathStyle: true,
  }),
);
