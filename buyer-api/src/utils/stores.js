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
 * @property {DataOrderStatus} status Current status of the DataOrder
 * @property {?number} dxId DataExchange id
 * @property {string[]} notariesAddresses Notaries' Ethereum addresses
 * @property {?Date} createdAt Creation date
 * @property {?Date} closedAt Date of clousure
 */
/**
 * @typedef {"waiting" | "queued" | "batched"} DataResponseStatus
 * @typedef DataResponse
 * @property {number} orderId Order ID in the DataExchange contract
 * @property {string} sellerAddress Seller's Ethereum address
 * @property {?number} sellerId Seller's ID in the BatPay contract
 * @property {string} decryptedDataHash Hash of the raw data
 * @property {string} decryptionKeyHash Hash of the key used to encrypt the data
 * @property {string} notaryAddress Notary's Ethereum address
 * @property {boolean} needsRegistration Whether the Seller needs to be registered in BatPay or not
 * @property {DataResponseStatus} status Current status of the DataResponse
 */
/**
 * @typedef {"created" | "processed"} DataResponseBatchStatus
 * @typedef DataResponseBatch
 * @property {number} orderId Order ID in the DataExchange contract
 * @property {string} notaryAddress Notary's Ethereum address
 * @property {string[]} dataResponseIds List of DataResponses IDs
 * @property {DataResponseBatchStatus} status Current status of the Batch
 */
/** @type {LevelStore<string, DataOrder>} */
export const dataOrders = createLevelStore('data_orders');
/** @type {LevelStore<string, DataResponse>} */
export const dataResponses = createLevelStore('data_responses');
/** @type {LevelStore<string, string[]>} */
export const dataResponsesAccumulator = createLevelStore('data_responses_accumulator');
/** @type {LevelStore<string, DataResponseBatch>} */
export const dataResponsesBatches = createLevelStore('data_responses_batches');
/** @type {LevelStore<string, number>} */
export const eventBlocks = createLevelStore('event_blocks');
/** @type {LevelStore<string, BuyerInfo>} */
export const buyerInfos = createLevelStore('buyer_infos');
export const buyerInfoPerOrder = createLevelStore('buyer_info_per_order');
export const notariesCache = createRedisStore('notaries.cache');
export const notarizationRequests = createRedisStore('notarization_requests');
