import apicache from 'apicache';
import { contractEventListener } from './contractEventListener';
import { DataExchange } from './contracts';
import { fetchDataOrder } from './dataOrder';
import { getAccount } from '../services/signingService';
import { dataOrders } from '../utils/stores';

export { contractEventListener };
const statusOrder = {
  creating: 0,
  created: 1,
  closing: 2,
  closed: 3,
};

const getOrderId = async (dxId) => {
  const { buyer, ...chainOrder } = await fetchDataOrder(dxId);
  const id = chainOrder.buyerUrl.match(/\/orders\/(.+)\/offchain-data/)[1];
  return { chainOrder, id };
};

/**
 * @typedef DataOrderEventValues
 * @property {string} owner The buyer that created the DataOrder
 * @property {number} orderId The DataExchange id of the DataOrder

 * @callback dataOrderUpdater Updates DataOrder in the store with data from the DataExchange
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event

 * @function createDataOrderUpdater Creates a dataOrderUpdater with the given status
 * @param {string} status The status to be set by the updater
 * @returns {dataOrderUpdater}
 */
export const createDataOrderUpdater =
  status => async ({ owner, orderId: dxId }, { transactionHash }) => {
    const { address } = await getAccount();
    if (address.toLowerCase() === owner.toLowerCase()) {
      const { chainOrder, id } = await getOrderId(dxId);
      const storedOrder = await dataOrders.fetch(id);
      if (statusOrder[storedOrder.status] < statusOrder[status]) {
        await dataOrders.store(id, {
          ...storedOrder,
          ...chainOrder,
          dxId,
          transactionHash,
          status,
        });
        apicache.clear('/orders/*');
      }
    }
  };

/**
 * @callback closeDataOrder Updates DataOrder in the store with closed status
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event
 *
 * @function createCloseDataOrder Creates a closeDataOrder
 * @returns {closeDataOrder}
 */
export const createCloseDataOrder = async ({ owner, orderId: dxId }) => {
  const { address } = await getAccount();
  if (address.toLowerCase() === owner.toLowerCase()) {
    const { id } = await getOrderId(dxId);
    await dataOrders.update(id, { status: 'closed' });
    apicache.clear('/orders/*');
  }
};

contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', createDataOrderUpdater('created'))
  .on('DataOrderClosed', createCloseDataOrder);

