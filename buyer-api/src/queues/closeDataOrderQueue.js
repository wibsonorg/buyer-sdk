import { createQueue } from './createQueue';
import {
  closeDataOrderFacade,
  onDataOrderClosed,
  onBatchClosed,
} from '../facades';

const closeDataOrderQueue = ({ closedDataOrdersCache }) => {
  const queue = createQueue('CloseDataOrderQueue');

  // NOTE: The processing can be done in a separate process by specifying the
  //       path to a module instead of function.
  // @see https://github.com/OptimalBits/bull#separate-processes
  queue.process('closeDataOrder', async (
    {
      data: {
        orderAddr, account, batchId, batchLength,
      },
    },
  ) => {
    await closeDataOrderFacade(orderAddr, account, batchId, batchLength, (jobName, params) => {
      queue.add(jobName, params, {
        priority: 100,
        attempts: 20,
        backoff: {
          type: 'linear',
        },
      });
    });
  });

  queue.process('dataOrderClosed', async (
    {
      data: {
        batchId, batchLength,
      },
    },
  ) => {
    const finishedStatus = await onDataOrderClosed(batchId, batchLength, closedDataOrdersCache);
    const { result: { status } } = finishedStatus;
    console.log({ finishedStatus });
    console.log({ status });
    if (status === 'done') {
      await onBatchClosed(batchId);
    }
  });

  return queue;
};

export { closeDataOrderQueue };
