import apicache from 'apicache';
import { getAccount } from '../services/signingService';
import { fetchDataOrder } from '../utils/blockchain';
import { dataOrders } from '../utils/stores';

/**
 * @callback dataOrderUpdapter Updates DataOrder in the store with data from the DataExchange
 * @param {Object} eventValues The values emmited by the DataExchange event
 * @param {string} eventValues.owner The buyer that created the DataOrder
 * @param {number} eventValues.orderId The DataExchange id of the DataOrder
 */
/**
 * @function createDataOrderUpdapter Creates a dataOrderUpdapter with the given status
 * @param {string} status The status to be set by the updater
 * @returns {dataOrderUpdapter}
 */
const createDataOrderUpdapter = status => async ({ owner, orderId: dxId }) => {
  const { address } = await getAccount();
  if (address === owner) {
    const chainOrder = await fetchDataOrder(dxId);
    const id = chainOrder.buyerUrl.match(/\/orders\/(.+)\/offchain-data/)[1];
    const storedOrder = await dataOrders.fetch(id);
    await dataOrders.store(id, {
      ...storedOrder,
      ...chainOrder,
      dxId,
      status,
    });
    apicache.clear('/orders/*');
  }
};

export const dataOrderCacheSubscriber = {
  name: 'DataOrderUpdater',
  DataOrderCreated: createDataOrderUpdapter('created'),
  DataOrderClosed: createDataOrderUpdapter('closed'),
};
