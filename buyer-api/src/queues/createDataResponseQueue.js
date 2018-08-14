import { createQueue } from './createQueue';
import {
  buyData,
  onAddDataResponseSent,
  onCloseDataResponseSent,
} from '../facades';

const createDataResponseQueue = () => {
  const queue = createQueue('DataResponseQueue');

  // NOTE: The processing can be done in a separate process by specifying the
  //       path to a module instead of function.
  // @see https://github.com/OptimalBits/bull#separate-processes
  queue.process('buyData', async (
    { data: { orderAddress, sellerAddress } },
  ) => {
    await buyData(orderAddress, sellerAddress, queue);
  });

  queue.process('addDataResponseSent', async (
    { data: { receipt, orderAddress, sellerAddress } },
  ) => {
    await onAddDataResponseSent(receipt, orderAddress, sellerAddress, queue);
  });

  queue.process('closeDataResponseSent', async (
    { data: { receipt, orderAddress, sellerAddress } },
  ) => {
    await onCloseDataResponseSent(receipt, orderAddress, sellerAddress);
  });

  return queue;
};

export { createDataResponseQueue };
