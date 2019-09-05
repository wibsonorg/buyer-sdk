import { addTransactionJob } from '../queues/transactionQueue';
import { dataOrders } from '../utils/stores';

/**
 * @async
 * @param {String} orderId the internal id of the order to be closed.
 * @param {import('../utils/stores').DataOrder} the order to be closed.
 */
export const closeDataOrder = async (orderId, order) => {
  await addTransactionJob('CloseDataOrder', { orderId: order.dxId });
  await dataOrders.update(orderId, { status: 'closing' });
  return { status: 'closing' };
};
