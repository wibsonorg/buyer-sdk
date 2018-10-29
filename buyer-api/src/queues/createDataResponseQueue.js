import { createQueue } from './createQueue';
import {
  onBuyData,
  onAddDataResponseSent,
  onCloseDataResponseSent,
} from '../facades';

const createDataResponseQueue = ({ notariesCache }) => {
  const queue = createQueue('DataResponseQueue');

  // NOTE: The processing can be done in a separate process by specifying the
  //       path to a module instead of function.
  // @see https://github.com/OptimalBits/bull#separate-processes
  queue.process('buyData', async (
    { data: { orderAddress, sellerAddress } },
  ) => {
    await onBuyData(orderAddress, sellerAddress, (params) => {
      queue.add('addDataResponseSent', params, {
        priority: 10,
        attempts: 20,
        backoff: {
          type: 'linear',
        },
      });
    });
  });

  queue.process('addDataResponseSent', async (
    { data: { receipt, orderAddress, sellerAddress } },
  ) => {
    await onAddDataResponseSent(
      receipt,
      orderAddress,
      sellerAddress,
      notariesCache,
      (params) => {
        queue.add('closeDataResponseSent', params, {
          priority: 100,
          attempts: 20,
          backoff: {
            type: 'linear',
          },
        });
      },
    );
  });

  queue.process('closeDataResponseSent', async (
    { data: { receipt, orderAddress, sellerAddress } },
  ) => {
    await onCloseDataResponseSent(receipt, orderAddress, sellerAddress);
  });

  return queue;
};

export { createDataResponseQueue };
