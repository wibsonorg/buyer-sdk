import apicache from 'apicache';
import { fetchDataOrder } from '../dataOrder';
import { getAccount } from '../../services/signingService';
import { dataOrders } from '../../utils/stores';

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
 * @property {string} buyer The buyer that created the DataOrder
 * @property {number} orderId The DataExchange id of the DataOrder

 * @callback onDataOrderCreated Updates DataOrder in the store with data from the DataExchange
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event
 */
export const onDataOrderCreated = async ({ buyer, orderId }, { transactionHash }) => {
  const dxId = Number(orderId);
  const { address } = await getAccount();
  if (address.toLowerCase() === buyer.toLowerCase()) {
    const { chainOrder, id } = await getOrderId(dxId);
    const storedOrder = await dataOrders.fetch(id);
    if (statusOrder[storedOrder.status] < statusOrder.created) {
      await dataOrders.store(id, {
        ...storedOrder,
        ...chainOrder,
        dxId,
        transactionHash,
        status: 'created',
      });
      apicache.clear('/orders/*');
    }
  }
};

/**
 * @callback onDataOrderClosed Updates DataOrder in the store with closed status
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event
 */
export const onDataOrderClosed = async ({ buyer, orderId }) => {
  const dxId = Number(orderId);
  const { address } = await getAccount();
  if (address.toLowerCase() === buyer.toLowerCase()) {
    const { id } = await getOrderId(dxId);
    await dataOrders.update(id, { status: 'closed' });
    apicache.clear('/orders/*');
  }
};
