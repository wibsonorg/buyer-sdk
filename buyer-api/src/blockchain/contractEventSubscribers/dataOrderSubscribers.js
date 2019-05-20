import apicache from 'apicache';
import { fetchDataOrder } from '../dataOrder';
import { getAccount } from '../../services/signingService';
import { dataOrders } from '../../utils/stores';
import { jobify } from '../../utils/jobify';

const statusOrder = {
  creating: 0,
  created: 1,
  closing: 2,
  closed: 3,
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
    const { id, ...chainOrder } = await fetchDataOrder(dxId);
    await dataOrders.update(id, (oldOrder) => {
      if (statusOrder[oldOrder.status] < statusOrder.created) {
        apicache.clear('/orders/*');
        return {
          ...chainOrder,
          dxId,
          transactionHash,
          status: 'created',
        };
      }
      return undefined;
    });
  }
};
export const onDataOrderCreatedJob = jobify(onDataOrderCreated);

/**
 * @callback onDataOrderClosed Updates DataOrder in the store with closed status
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event
 */
export const onDataOrderClosed = async ({ buyer, orderId }) => {
  const dxId = Number(orderId);
  const { address } = await getAccount();
  if (address.toLowerCase() === buyer.toLowerCase()) {
    const { id, closedAt } = await fetchDataOrder(dxId);
    await dataOrders.update(id, { status: 'closed', closedAt });
    apicache.clear('/orders/*');
  }
};
export const onDataOrderClosedJob = jobify(onDataOrderClosed);
