import { createQueue } from './createQueue';
import { enqueueTransaction } from '.';
import { onBuyData, closeDataResponse } from '../facades';

const createDataResponseQueue = () => {
  const queue = createQueue('DataResponseQueue');

  queue.process('buyData', async (
    { data: { orderAddress, sellerAddress } },
  ) => {
    await onBuyData(orderAddress, sellerAddress, enqueueTransaction);
  });

  queue.process('closeDataResponse', async (
    { data: { orderAddress, sellerAddress } },
  ) => {
    await closeDataResponse(orderAddress, sellerAddress, enqueueTransaction);
  });

  return queue;
};

const dataResponseQueue = createDataResponseQueue();
const enqueueCloseDataResponse = (orderAddress, sellerAddress, options = {}) => {
  const {
    priority = 1000, attempts = 20, backoffType = 'linear',
  } = options;

  dataResponseQueue.add('closeDataResponse', { orderAddress, sellerAddress }, {
    priority,
    attempts,
    backoff: {
      type: backoffType,
    },
  });
};

export { dataResponseQueue, enqueueCloseDataResponse };
