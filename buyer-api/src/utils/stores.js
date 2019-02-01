import { createLevelStore, createRedisStore } from './storage';

export const dataOrders = createLevelStore('data_orders');
export const dataResponses = createLevelStore('data_responses');
export const eventBlocks = createLevelStore('event_blocks');
export const buyerInfos = createLevelStore('buyer_infos');
export const buyerInfoPerOrder = createLevelStore('buyer_info_per_order');
export const notariesCache = createRedisStore('notaries.cache');
