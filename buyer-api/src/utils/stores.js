import { createLevelStore, createRedisStore } from './storage';

export const dataOrders = createLevelStore('data_orders');
const dataResponses = createLevelStore('data_responses');
export const eventBlocks = createLevelStore('event_blocks');
export const buyerInfos = createLevelStore('buyer_infos');
export const buyerInfoPerOrder = createLevelStore('buyer_info_per_order');
export const notariesCache = createRedisStore('notaries.cache');

export const storeDataOrder = async (key, payload) =>
  dataOrders.put(key, JSON.stringify(payload));

export const fetchDataOrder = async key =>
  dataOrders.get(key).then(JSON.parse);

export const storeDataResponse = async (key, payload) =>
  dataResponses.put(key, JSON.stringify(payload));

export const fetchDataResponse = async key =>
  dataResponses.get(key).then(JSON.parse);
