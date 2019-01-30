import { createLevelStore, createRedisStore } from './storage';

/** @type {import('./storage').LevelStore<string,DataOrder>} */
export const dataOrders = createLevelStore('data_orders');
/** @type {import('./storage').LevelStore<string,number>} */
export const eventBlocks = createLevelStore('event_blocks');
/** @type {import('./storage').LevelStore<string,BuyerInfo>} */
export const buyerInfos = createLevelStore('buyer_infos');
export const buyerInfoPerOrder = createLevelStore('buyer_info_per_order');
export const notariesCache = createRedisStore('notaries.cache');
