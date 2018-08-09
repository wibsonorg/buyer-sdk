import Queue from 'bull';
import { logger, web3 } from '../utils';
import { addNotariesToOrderFacade } from '../facades';
import {
  getTransactionReceipt,
  extractEventArguments,
} from '../facades/helpers';

const PREFIX = 'buyer-api:jobs';

const createDataOrderQueue = ({ contracts }) => {
  const { dataExchange } = contracts;

  const dataOrderQueue = new Queue('DataOrderQueue', {
    prefix: PREFIX,
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
    },
  });

  dataOrderQueue.process('addNotariesToOrder', async (
    { data: { receipt, notaries } },
  ) => {
    const { logs } = await getTransactionReceipt(web3, receipt);
    const { orderAddr } = extractEventArguments(
      'NewOrder',
      logs,
      dataExchange,
    );
    const response = await addNotariesToOrderFacade(
      orderAddr,
      notaries,
      dataExchange,
    );

    if (!response.success()) {
      throw new Error('Could not add notaries to order');
    }
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
