import { createQueue } from './createQueue';
import { dataExchange } from '../utils';
import { onDataOrderSent, addNotariesToOrderFacade } from '../facades';
import { associateBuyerInfoToOrder } from '../services/buyerInfo';

const createDataOrderQueue = ({ buyerInfos, buyerInfoPerOrder }) => {
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
      dataExchange,
    );

    if (!response.success()) {
      throw new Error('Could not add notaries to order');
    }
  });

  queue.process('associateBuyerInfoToOrder', async (
    { data: { orderAddr, buyerInfoId } },
  ) => {
    await associateBuyerInfoToOrder(
      orderAddr,
      buyerInfoId,
      buyerInfoPerOrder,
      buyerInfos,
    );
  });

  return queue;
};

export { createDataOrderQueue };
