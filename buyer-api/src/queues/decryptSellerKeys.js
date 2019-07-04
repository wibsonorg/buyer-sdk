import { createQueue } from './createQueue';
import logger from '../utils/logger';
import { notarizations } from '../utils/stores';
import { AESdecrypt } from '../utils/wibson-lib/cryptography/encription';
import { getData, getRawOrderData, putRawOrderData } from '../utils/wibson-lib/s3';
import { /* decryptWithPrivateKey */ } from '../utils/wibson-lib/cryptography/ec-encription';

const queue = createQueue('DecryptSellerKeys');

export const addDecryptJob = params => queue.add('decrypt', params);


// retrieve seller data from s3 buket
const getDecryptedSellerData = async (orderId, sellerAddress, key) => {
  logger.debug(`getDecryptedSellerData begins ${orderId}/${sellerAddress}/${key}`);
  const encryptedData = await getData(orderId, sellerAddress);
  // TODO: use eliptic curves when ready
  // const result = decryptWithPrivateKey(key, encryptedData);
  const result = JSON.parse(AESdecrypt(key, encryptedData));
  logger.debug('getDecryptedSellerData ends', { result, encryptedData });
  return result;
};

export const decryptSellersKeysJobListener = async ({ id, data: { notarizationId } }) => {
  logger.debug(`Processing Decrypt Sellers Keys Job id ${id} with notarizationId ${notarizationId}`);
  const { masterKey, orderId, result: { sellers } } = await notarizations.fetch(notarizationId);
  const sellersWithData = await Promise.all(sellers
    .map(async ({ address, decryptionKeyEncryptedWithMasterKey }) => {
      const key = AESdecrypt(masterKey, decryptionKeyEncryptedWithMasterKey);
      return ({
        address,
        data: await getDecryptedSellerData(orderId, address, key),
      });
    }));
  logger.debug('Sellers prepared with Data');
  // get existing order object
  const rawOrderData = await getRawOrderData(orderId);
  logger.debug('Took current order data object');
  // TODO: double check, are we going to index totals by seller address?
  // append reduced sellers data to total
  const allBatchSellers = sellersWithData.reduce(
    (acc, curr) => ({ ...acc, [curr.address]: curr.data }),
    {},
  );
  logger.debug('All batch sellers', { allBatchSellers });
  // put order object
  await putRawOrderData(orderId, { ...rawOrderData, ...allBatchSellers });
  logger.debug('Bucket updated with decrypted data.');
};

queue.process('decrypt', decryptSellersKeysJobListener);
queue.on('failed', ({ id, name, failedReason }) => {
  logger.error(`N[${id}] :: ${name} :: Error thrown: ${failedReason} (will be retried)`);
});

