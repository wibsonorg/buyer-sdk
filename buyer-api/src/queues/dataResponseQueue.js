import { createQueue } from './createQueue';
import { enqueueTransaction } from './transactionQueue';
import { priority } from './priority';
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
    priority: p, attempts = 20, backoffType = 'linear',
  } = options;

  dataResponseQueue.add('closeDataResponse', { orderAddress, sellerAddress }, {
    priority: p || priority.LOW,
    attempts,
    backoff: {
      type: backoffType,
    },
  });
};

export { dataResponseQueue, enqueueCloseDataResponse };
