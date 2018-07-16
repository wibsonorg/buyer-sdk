import url from "url";

import aws from "aws-sdk";

class AWSWrapper {
  constructor(s3) {
    this.s3 = s3;
  }

  _promisifyMethod(methodName, params) {
    return new Promise((resolve, reject) => {
      this.s3[methodName](params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        } else {
          // console.log(methodName, data); // successful response
          resolve(data);
        }
      });
    });
  }

  putObject(bucket, objectName, object) {
    const params = {
      Body: object,
      Bucket: bucket,
      Key: objectName
    };
    return this._promisifyMethod("putObject", params);
  }

  getObject(bucket, objectName) {
    const params = {
      Bucket: bucket,
      Key: objectName
    };
    return this._promisifyMethod("getObject", params);
  }

  async listObjects(bucket, prefix) {
    let objects = [];
    let isTruncated = true;
    let continuationToken = undefined;

    while (isTruncated) {
      const params = {
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken
      };
      const batch = await this._promisifyMethod("listObjectsV2", params);
      objects = [
        ...objects,
        ...batch.Contents
      ];
      isTruncated = batch.IsTruncated;
      continuationToken = batch.NextContinuationToken;
    }
    return objects;
  }

  makeBucket(bucketName, location) {
    const params = {
      Bucket: bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: location
      }
    };
    return this._promisifyMethod("createBucket", params);
  }

  bucketExists(bucketName) {
    const params = {
      Bucket: bucketName
    };
    return this._promisifyMethod("headBucket", params);
  }
}

const getS3Client = uri => {
  if (!uri) throw new Error("A URI is required");

  const location = url.parse(uri);
  const [accessKeyId, secretAccessKey] = location.auth
    ? location.auth.split(":")
    : [];
  const endpoint = `${location.protocol}//${location.host}`;

  const client = new aws.S3({
    accessKeyId,
    secretAccessKey,
    endpoint,
    s3ForcePathStyle: true
  });

  return new AWSWrapper(client);
};

export default getS3Client;
