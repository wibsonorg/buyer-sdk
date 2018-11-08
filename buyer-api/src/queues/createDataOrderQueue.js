import { createQueue } from './createQueue';
import { enqueueTransaction } from './transactionQueue';
import { priority } from './priority';
import {
  createDataOrderFacade,
  addNotariesToOrderFacade,
  addNotaryToOrder,
} from '../facades';
import { associateBuyerInfoToOrder } from '../services/buyerInfo';
import { associateOrderToBatch } from '../services/batchInfo';

const createDataOrderQueue = () => {
  const queue = createQueue('DataOrderQueue');

  queue.process('createDataOrder', async (
    { data },
  ) => {
    await createDataOrderFacade(
      data,
      enqueueTransaction,
      (jobName, params) => {
        queue.add(jobName, params, {
          priority: priority.HIGH,
          attempts: 20,
          backoff: {
            type: 'linear',
          },
        });
      },
    );
  });

  queue.process('addNotariesToOrder', async (
    { data: { orderAddr, account, notaries } },
  ) => {
    const response = await addNotariesToOrderFacade(
      orderAddr,
      account,
      notaries,
      (params) => {
        queue.add('addNotaryToOrder', params, {
          priority: priority.HIGH,
          attempts: 20,
          backoff: {
            type: 'linear',
          },
        });
      },
    );

    if (!response.success()) {
      throw new Error('Could not add notaries to order');
    }
  });

  queue.process('associateBuyerInfoToOrder', async (
    { data: { orderAddr, buyerInfoId } },
  ) => {
    await associateBuyerInfoToOrder(orderAddr, buyerInfoId);
  });

  queue.process('addNotaryToOrder', async (
    { data: { account, notaryParameters } },
  ) => {
    await addNotaryToOrder(
      account,
      notaryParameters,
      enqueueTransaction,
    );
  });

  queue.process('associateOrderToBatch', async (
    { data: { batchId, orderAddr } },
  ) => {
    await associateOrderToBatch(batchId, orderAddr);
  });

  return queue;
};

const dataOrderQueue = createDataOrderQueue();

export { dataOrderQueue };
