import apicache from 'apicache';
import {
  fetchAndCacheDataOrder,
  fetchAndCacheNotary,
} from '../facades';

const subscriberCallback = async (res, { ordersCache }) => {
  const { notary, orderAddr } = res.returnValues;
  if (orderAddr) {
    await fetchAndCacheDataOrder(orderAddr, ordersCache);
    apicache.clear('/orders/*');
  }

  if (notary) {
    await fetchAndCacheNotary(notary);
    apicache.clear('/notaries/*');
  }
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
