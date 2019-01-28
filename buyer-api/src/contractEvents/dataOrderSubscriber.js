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
  async callback({ returnValues: { orderId: id, owner } }) {
    const { address } = await getAccount();
    if (address === owner) {
      const [storedOrder, chainOrder] = await Promise.all([
        dataOrders.fetch(id),
        fetchDataOrder(id),
      ]);
      await dataOrders.store(id, {
        ...storedOrder,
        ...chainOrder,
      });
      apicache.clear('/orders/*');
    }
  },
};
