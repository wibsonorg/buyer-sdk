import { createQueue } from './createQueue';
import { onDataOrderSent, addNotariesToOrderFacade } from '../facades';
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

  return queue;
};

export { createDataOrderQueue };
