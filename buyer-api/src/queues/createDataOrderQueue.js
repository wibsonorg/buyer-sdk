import { createQueue } from './createQueue';
import {
  onDataOrderSent,
  addNotariesToOrderFacade,
  addNotaryToOrder,
  onAddNotaryToOrderSent,
} from '../facades';
import { associateBuyerInfoToOrder } from '../services/buyerInfo';

const createDataOrderQueue = ({ notariesCache }) => {
  const queue = createQueue('DataOrderQueue');

  // NOTE: The processing can be done in a separate process by specifying the
  //       path to a module instead of function.
  // @see https://github.com/OptimalBits/bull#separate-processes
  queue.process('dataOrderSent', async (
    { data: { receipt, notaries, buyerInfoId } },
  ) => {
    await onDataOrderSent(receipt, notaries, buyerInfoId, queue);
  });

  queue.process('addNotariesToOrder', async (
    { data: { orderAddr, notaries } },
  ) => {
    const response = await addNotariesToOrderFacade(
      orderAddr,
      notaries,
      notariesCache,
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
    { data: { notaryParameters, buyerAddress } },
  ) => {
    await addNotaryToOrder(
      notaryParameters,
      buyerAddress,
      (params) => {
        queue.add('addNotaryToOrderSent', params, {
          priority: 100,
          attempts: 20,
          backoff: {
            type: 'linear',
          },
        });
      },
    );
  });

  queue.process('addNotaryToOrderSent', async (
    {
      data: {
        receipt,
        orderAddress,
        notaryAddress,
        buyerAddress,
      },
    },
  ) => {
    await onAddNotaryToOrderSent(
      receipt,
      orderAddress,
      notaryAddress,
      buyerAddress,
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
