import { addTransactionJob } from '../queues/transactionQueue';
import { dataOrders } from '../utils/stores';

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @returns {Response} The result of the operation.
 */
export const closeDataOrder = async (orderId, order) => {
  addTransactionJob(
    'closeDataOrder',
    { orderId: order.dxId },
  );

  await dataOrders.update(orderId, { status: 'closing' });

  return { status: 'pending' };
};

