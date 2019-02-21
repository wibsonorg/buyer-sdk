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
/**
 * @typedef DataOrderEventValues
 * @property {string} owner The buyer that created the DataOrder
 * @property {number} orderId The DataExchange id of the DataOrder

 * @callback dataOrderUpdapter Updates DataOrder in the store with data from the DataExchange
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event

 * @function createDataOrderUpdapter Creates a dataOrderUpdapter with the given status
 * @param {string} status The status to be set by the updater
 * @returns {dataOrderUpdapter}
 */
const createDataOrderUpdapter = status => async ({ owner, orderId: dxId }, { transactionHash }) => {
  const { address } = await getAccount();
  if (address.toLowerCase() === owner.toLowerCase()) {
    const { buyer, ...chainOrder } = await fetchDataOrder(dxId);
    const id = chainOrder.buyerUrl.match(/\/orders\/(.+)\/offchain-data/)[1];
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

contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', createDataOrderUpdapter('created'))
  .on('DataOrderClosed', createDataOrderUpdapter('closed'));
