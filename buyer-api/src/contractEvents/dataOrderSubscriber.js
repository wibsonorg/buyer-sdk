import apicache from 'apicache';
import { getAccount } from '../services/signingService';
import { fetchDataOrder } from '../utils/blockchain';
import { dataOrders } from '../utils/stores';

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
  name: 'CacheUpdater',
  DataOrderCreated: createDataOrderUpdapter('created'),
  DataOrderClosed: createDataOrderUpdapter('closed'),
};
