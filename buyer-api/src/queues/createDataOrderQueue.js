import { createQueue } from './createQueue';
import {
  createDataOrderFacade,
  onDataOrderSent,
  addNotariesToOrderFacade,
} from '../facades';
import { associateBuyerInfoToOrder } from '../services/buyerInfo';
import { associateOrderToBatch } from '../services/batchInfo';

const createDataOrderQueue = ({ notariesCache }) => {
  const queue = createQueue('DataOrderQueue');

  // NOTE: The processing can be done in a separate process by specifying the
  //       path to a module instead of function.
  // @see https://github.com/OptimalBits/bull#separate-processes
  queue.process('createDataOrder', async (
    { data },
  ) => {
    await createDataOrderFacade(data, (jobName, params) => {
      queue.add(jobName, params, {
        priority: 100,
        attempts: 20,
        backoff: {
          type: 'linear',
        },
      });
    });
  });

  queue.process('dataOrderSent', async (
    {
      data: {
        receipt, account, notaries, buyerInfoId, batchId,
      },
    },
  ) => {
    await onDataOrderSent(
      receipt, account, notaries, buyerInfoId, batchId,
      (jobName, params) => {
        queue.add(jobName, params, {
          priority: 10,
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
      notariesCache,
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

  queue.process('associateOrderToBatch', async (
    { data: { batchId, orderAddr } },
  ) => {
    await associateOrderToBatch(batchId, orderAddr);
  });

  return queue;
};

export { createDataOrderQueue };
