import { createQueue } from './createQueue';
import { enqueueTransaction } from './transactionQueue';
import {
  createDataOrderFacade,
  addNotariesToOrderFacade,
  addNotaryToOrder,
} from '../facades';
import { associateBuyerInfoToOrder } from '../services/buyerInfo';

const createDataOrderQueue = () => {
  const queue = createQueue('DataOrderQueue');

  queue.process('createDataOrder', async (
    { data: { dataOrder } },
  ) => {
    await createDataOrderFacade(
      dataOrder,
      enqueueTransaction,
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
    { data: { orderAddr, notaries } },
  ) => {
    const response = await addNotariesToOrderFacade(
      orderAddr,
      notaries,
      (params) => {
        queue.add('addNotaryToOrder', params, {
          priority: 10,
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

  queue.process('addNotaryToOrder', async (
    { data: { account, notaryParameters } },
  ) => {
    await addNotaryToOrder(
      account,
      notaryParameters,
      enqueueTransaction,
    );
  });

  queue.process('associateBuyerInfoToOrder', async (
    { data: { orderAddr, buyerInfoId } },
  ) => {
    await associateBuyerInfoToOrder(orderAddr, buyerInfoId);
  });

  return queue;
};

export { createDataOrderQueue };
