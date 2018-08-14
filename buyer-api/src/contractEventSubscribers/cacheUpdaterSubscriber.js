import apicache from 'apicache';
import {
  fetchAndCacheDataOrder,
  fetchAndCacheNotary,
} from '../facades';
import { logger } from '../utils';

const subscriberCallback = async (res, { ordersCache, notariesCache }) => {
  logger.debug('[Cache Updater] received:', { event: res.event });

  const { notary, orderAddr } = res.args;
  if (orderAddr) {
    await fetchAndCacheDataOrder(orderAddr, ordersCache);
  }
  if (notary) {
    await fetchAndCacheNotary(notary, notariesCache);
  }

  // The following line only clears the cache for the API responses, and it does
  // not regenerate it since there is no elegant way to do it from here. But, it
  // is not an issue since both `fetchAndCacheDataOrder` and
  // `fetchAndCacheSellerInfo` do the hard part of fetching the information from
  // the blockchain and storing it in Redis.
  apicache.clear('/orders/*');
  apicache.clear('/notaries/*');

  logger.debug('[Cache Updater] done');
};

export default {
  name: 'CacheUpdater',
  callback: subscriberCallback,
  events: [
    'NotaryRegistered',
    'NotaryUpdated',
    'NotaryUnregistered',
    'NotaryAddedToOrder',
    'DataAdded',
    'TransactionCompleted',
    'OrderClosed',
  ],
};
