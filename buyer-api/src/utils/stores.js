import { createLevelStore, createRedisStore } from './storage';
/**
 * @typedef {import('./storage').LevelStore<K,V>} LevelStore
 * @template K
 * @template V
 */
/**
 * @typedef {"creating" | "created" | "closeing" | "closed"} DataOrderStatus
 * @typedef DataOrder
 * @property {Object<string, *>} audience Target audience of the order
 * @property {number} price Price per added Data Response
 * @property {string[]} requestedData Requested data types
 * @property {string} buyerUrl Url to get extra information
 * @property {string} termsAndConditionsHash Hash of the terms and conditions
 * @property {DataOrderStatus} status Current status of the
 * @property {?number} dxId DataExchange id
 * @property {?Date} createdAt Creation date
 * @property {?Date} closedAt Date of clousure
 */
/** @type {LevelStore<string, DataOrder>} */
export const dataOrders = createLevelStore('data_orders');
/** @type {LevelStore<string, number>} */
export const eventBlocks = createLevelStore('event_blocks');
/** @type {LevelStore<string, BuyerInfo>} */
export const buyerInfos = createLevelStore('buyer_infos');
export const buyerInfoPerOrder = createLevelStore('buyer_info_per_order');
export const notariesCache = createRedisStore('notaries.cache');
