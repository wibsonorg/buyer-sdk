import apicache from 'apicache';
// import {
//   fetchAndCacheDataOrder,
//   fetchAndCacheSellerInfo,
// } from '../facades/ordersFacade';
import { logger } from '../utils';

const subscriberCallback = async (res, { ordersCache, sellerInfosCache }) => {
  logger.debug(`[Cache Updater] received: ${res.event}`);

  // const { orderAddr, seller } = res.args;
  // await fetchAndCacheDataOrder(orderAddr, ordersCache);

  // if (res.event === 'DataAdded') {
  //   await fetchAndCacheSellerInfo(orderAddr, seller, sellerInfosCache);
  // }

  // The following line only clears the cache for the API responses, and it does
  // not regenerate it since there is no elegant way to do it from here. But, it
  // is not an issue since both `fetchAndCacheDataOrder` and
  // `fetchAndCacheSellerInfo` do the hard part of fetching the information from
  // the blockchain and storing it in Redis.
  // apicache.clear('/orders/*');

  logger.debug('[Cache Updater] done');
};

export default {
  name: 'CacheUpdater',
  callback: subscriberCallback,
  events: [
    'NotaryAddedToOrder',
    'DataAdded',
    'TransactionCompleted',
    'OrderClosed',
  ],
};
