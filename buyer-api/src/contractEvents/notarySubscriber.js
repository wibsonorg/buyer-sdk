import apicache from 'apicache';
import { fetchAndCacheNotary } from '../facades';

export const notarySubscriber = {
  name: 'NotaryCacheUpdater',
  events: [
    'NotaryRegistered',
    'NotaryUpdated',
    'NotaryUnregistered',
  ],
  async callback(res) {
    await fetchAndCacheNotary(res.returnValues.notary);
    apicache.clear('/notaries/*');
  },
};
