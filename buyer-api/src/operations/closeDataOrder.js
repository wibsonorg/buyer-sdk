import { enqueueTransaction } from '../queues';
import { dataOrders } from '../utils/stores';
import { getAccount } from '../services/signingService';
import config from '../../config';

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @returns {Response} The result of the operation.
 */
const closeDataOrder = async (orderId, order) => {
  const account = await getAccount();

  enqueueTransaction(
    account,
    'closeDataOrder',
    { orderId: order.dxId },
    config.contracts.gasPrice.fast,
  );

  await dataOrders.update(orderId, { status: 'closing' });

  return { status: 'pending' };
};

export default closeDataOrder;
