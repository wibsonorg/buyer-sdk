import uuid from 'uuid/v4';
import { createQueue } from './createQueue';
import { dataResponses, dataResponsesBatches as batches } from '../utils/stores';
import logger from '../utils/logger';

const createNotarizationRequest = () => uuid();

const queue = createQueue('NotarizationQueue');

export const prepare = async ({ id, data: { batchId } }) => {
  const { orderId, notaryAddress, dataResponseIds } = await batches.fetch(batchId);
  const sellers = dataResponseIds.reduce(async (accumulator, dataResponseId) => {
    const {
      sellerAddress,
      sellerId,
      decryptionKeyHash,
    } = await dataResponses.fetch(dataResponseId);
    return [...accumulator, { sellerAddress, sellerId, decryptionKeyHash }];
  }, []);

  const notarizationRequestId = await createNotarizationRequest({
    orderId,
    notaryAddress,
    sellers
  });
  await addRequestNotarizationJob({ notarizationRequestId });

  return notarizationRequestId;
};

export const request = async ({ id }) => {
  logger.info(`N[${id}] :: Request :: fake implementation`);
  return true;
};

queue.process('prepare', prepare);
queue.process('request', request);
queue.on('failed', ({ id, name, failedReason }) => {
  logger.error(`N[${id}] :: ${name} :: Error thrown: ${failedReason} (will be retried)`);
});

export const addPrepareNotarizationJob = params => queue.add('prepare', params);
export const addRequestNotarizationJob = params => queue.add('request', params);
