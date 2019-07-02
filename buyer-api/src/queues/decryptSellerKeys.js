import { createQueue } from './createQueue';
import logger from '../utils/logger';

const queue = createQueue('DecryptSellerKeys');

// on job listener
// const sellersWithKeys = notarization.result.sellers.map(
// ({ address, decryptionKeyEncryptedWithMasterKey }) => ({
//   address,
//   decryptionKeyEncryptedWithMasterKey,
// })
// );
// get existing csv
// for each seller get dec key, decrypt key
// // get data
// // decrypt data
// // append to existing csv
// upload csv to s3 in order folder

queue.process();
queue.on('failed', ({ id, name, failedReason }) => {
  logger.error(`N[${id}] :: ${name} :: Error thrown: ${failedReason} (will be retried)`);
});

