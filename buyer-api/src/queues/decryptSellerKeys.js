import { createQueue } from './createQueue';
import logger from '../utils/logger';
import { notarizations, dataOrdersByDxId } from '../utils/stores';
import { AESdecrypt } from '../utils/wibson-lib/cryptography/encription';
import { getData, putRawOrderData, safeGetRawOrderData } from '../utils/wibson-lib/s3';
import { decryptWithPrivateKey } from '../utils/wibson-lib/cryptography/ec-encription';

const queue = createQueue('DecryptSellerKeys');

export const addDecryptJob = params => queue.add('decrypt', params);


// retrieve seller data from s3 buket
const getDecryptedSellerData = async (orderUUID, sellerAddress, key) => {
  logger.debug(`getDecryptedSellerData begins ${orderUUID}/${sellerAddress}/${key}`);
  const encryptedData = await getData(orderUUID, sellerAddress);
  const result = JSON.parse(decryptWithPrivateKey(key, encryptedData));
  logger.debug('getDecryptedSellerData ends', { result, encryptedData });
  return result;
};

export const decryptSellersKeysJobListener = async ({ id, data: { notarizationId } }) => {
  logger.debug(`Processing Decrypt Sellers Keys Job id ${id} with notarizationId ${notarizationId}`);
  const {
    masterKey,
    request: { orderId },
    result: { sellers },
  } = await notarizations.fetch(notarizationId);
  const orderUUID = await dataOrdersByDxId.fetch(orderId);
  const sellersWithData = await Promise.all(sellers
    .map(async ({ address, decryptionKeyEncryptedWithMasterKey }) => {
      const key = AESdecrypt(masterKey, decryptionKeyEncryptedWithMasterKey);
      return ({
        address,
        data: await getDecryptedSellerData(orderUUID, address, key),
      });
    }));
  logger.debug('Sellers prepared with Data');
  // get existing order object
  const rawOrderData = await safeGetRawOrderData(orderUUID);
  logger.debug('Took current order data object');
  // append reduced sellers data to total
  const allBatchSellers = sellersWithData.reduce(
    (acc, { address, data }) => ({ ...acc, [address]: data }),
    {},
  );
  logger.debug('All batch sellers', { allBatchSellers });
  // put order object
  await putRawOrderData(orderUUID, { ...rawOrderData, ...allBatchSellers });
  logger.debug('Bucket updated with decrypted data.');
};

queue.process('decrypt', decryptSellersKeysJobListener);
queue.on('failed', ({ id, name, failedReason }) => {
  logger.error(`DSK[${id}] :: ${name} :: Error thrown: ${failedReason} (will be retried)`);
});

