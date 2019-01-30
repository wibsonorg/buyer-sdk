import apicache from 'apicache';
import { getAccount } from '../services/signingService';
import { fetchDataOrder } from '../utils/blockchain';
import { dataOrders } from '../utils/stores';

export const dataOrderCacheSubscriber = {
  name: 'CacheUpdater',
  events: [
    'DataOrderCreated',
    'DataOrderClosed',
  ],
  async callback({ returnValues: { orderId: dxId, owner } }) {
    const { address } = await getAccount();
    if (address === owner) {
      const chainOrder = await fetchDataOrder(dxId);
      const id = chainOrder.buyerUrl.match(/\/orders\/(.+)\/offchain-data/)[1];
      const storedOrder = await dataOrders.fetch(id);
      await dataOrders.store(id, {
        ...storedOrder,
        ...chainOrder,
        dxId,
        status: 'created',
      });
      apicache.clear('/orders/*');
    }
  },
};
