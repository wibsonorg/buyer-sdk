import Queue from 'bull';
import { logger } from '../utils';
import { onDataOrderSent, addNotariesToOrderFacade } from '../facades';
import { associateBuyerInfoToOrder } from '../services/buyerInfo';

const PREFIX = 'buyer-api:jobs';

const createDataOrderQueue = ({ contracts, stores }) => {
  const { dataExchange } = contracts;
  const { buyerInfos, buyerInfoPerOrder } = stores;

  const dataOrderQueue = new Queue('DataOrderQueue', {
    prefix: PREFIX,
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
    },
  });

  // NOTE: The processing can be done in a separate process by specifying the
  //       path to a module instead of function.
  // @see https://github.com/OptimalBits/bull#separate-processes
  dataOrderQueue.process('dataOrderSent', async (
    { data: { receipt, notaries, buyerInfoId } },
  ) => {
    await onDataOrderSent(receipt, notaries, buyerInfoId, dataOrderQueue);
  });

  dataOrderQueue.process('addNotariesToOrder', async (
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

  dataOrderQueue.process('associateBuyerInfoToOrder', async (
    { data: { orderAddr, buyerInfoId } },
  ) => {
    await associateBuyerInfoToOrder(
      orderAddr,
      buyerInfoId,
      buyerInfoPerOrder,
      buyerInfos,
    );
  });

  dataOrderQueue.on('failed', ({
    id, name, attemptsMade, failedReason,
  }) => {
    const fullJobId = `${PREFIX}:DataOrderQueue:${id}`;
    logger.error(`[${fullJobId}][${name}][${attemptsMade}] failed with reason: ${failedReason}`);
  });

  return dataOrderQueue;
};

export { createDataOrderQueue };
