import { createLevelStore, createRedisStore } from './storage';
/**
 * @typedef {import('./storage').LevelStore<K,V>} LevelStore
 * @template K
 * @template V
 *
 * @typedef {"creating" | "created" | "closing" | "closed"} DataOrderStatus
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
 *
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
 *
 * @typedef {"created" | "processed"} DataResponseBatchStatus
 * @typedef DataResponseBatch
 * @property {number} orderId Order ID in the DataExchange contract
 * @property {string} notaryAddress Notary's Ethereum address
 * @property {string[]} dataResponseIds List of DataResponses IDs
 * @property {DataResponseBatchStatus} status Current status of the Batch
 *
 * @typedef DataResponseLastAdded
 * @property {string} notaryAddress Notary's Ethereum address
 * @property {number} orderId Order ID in the DataExchange contract
 * @property {number} price Price per added Data Response
 *
 * @typedef NotarizationRequestSeller
 * @property {string} address Seller's Ethereum address
 * @property {number} id Seller ID in the DataExchange contract
 * @property {string} decryptionKeyHash Hash of the key that decrypts the information
 *
 * @typedef NotarizationRequest
 * @property {number} orderId Order ID in the DataExchange contract
 * @property {string} callbackUrl Url where the Notary has to respond
 * @property {NotarizationRequestSeller[]} sellers List of NotarizationRequestSeller
 *
 * @typedef NotarizationResultSeller
 * @property {string} address Seller's Ethereum address
 * @property {number} id Seller ID in the DataExchange contract
 * @property {string} result The result of the notarization for the current seller
 * @property {string} decryptionKeyEncryptedWithMasterKey Encrypted key
 *
 * @typedef NotarizationResult
 * @property {number} orderId Order ID in the DataExchange contract
 * @property {String} notaryAddress address for the notary
 * @property {number} notarizationPercentage notarized seller percentage
 * @property {number} notarizationFee fee for the notarized data
 * @property {String} payDataHash Hash for the payData
 * @property {String} lockingKeyHash Hash used to lock a batch of sellers to validate decryption key
 * @property {NotarizationResultSeller[]} sellers List of NotarizationResultSeller
 *
 * @typedef {"created" | "requested" | "responded"} NotarizationStatus
 * @typedef Notarization
 * @property {string} notaryAddress Notary's Ethereum address
 * @property {Date} requestedAt Date and Time when the request's been issued
 * @property {Date} respondedAt Date and Time when the result's been received
 * @property {NotarizationRequest} request Data Structure to request notarization
 * @property {NotarizationResult} result Notarization response Data Structure
 * @property {NotarizationStatus} status Current status of the Notarization
 *
 * @typedef Notary
 * @property {string} infoUrl Notary's API URL used to ask for its information.
 * @property {string} oldInfoUrl Notary's previous API URL, if it updated the information
 * or unregistered.
 * @property {boolean} isRegistered Flag indicating if the Notary is registered or not in
 * DataExchange.
 *
 * @typedef OrderStats
 * @property {number} ethSpent ETH consumed when registering the payment
 * @property {number} amountOfPayees Amount of destinataries
 *
 */

/** @type {LevelStore<number, string>} */
const dataOrdersByDxId = createLevelStore('data_orders_by_dx_id');
/** @type {LevelStore<string, DataOrder>} */
export const dataOrders = createLevelStore('data_orders');
const storeFn = dataOrders.store;
Object.assign(dataOrders, {
  store: async (id, dataOrder) =>
    Promise.all([
      storeFn(id, dataOrder),
      typeof dataOrder.dxId === 'number' && dataOrdersByDxId.store(dataOrder.dxId, id),
    ]),
  fetchByDxId: async (dxId) => {
    const id = await dataOrdersByDxId.fetch(dxId);
    return dataOrders.fetch(id);
  },
});
/** @type {LevelStore<string, DataResponse>} */
export const dataResponses = createLevelStore('data_responses');
/** @type {LevelStore<string, string[]>} */
export const dataResponsesAccumulator = createLevelStore('data_responses_accumulator');
/** @type {LevelStore<string, DataResponseBatch>} */
export const dataResponsesBatches = createLevelStore('data_responses_batches');
/** @type {LevelStore<string, DataResponseLastAdded>} */
export const dataResponsesLastAdded = createLevelStore('data_responses_last_added');
/** @type {LevelStore<string, Notarization>} */
export const notarizations = createLevelStore('notarizations');
/** @type {LevelStore<string, Notary>} */
export const notaries = createLevelStore('notaries');
/** @type {LevelStore<string, number>} */
export const eventBlocks = createLevelStore('event_blocks');
/** @type {LevelStore<string, BuyerInfo>} */
export const buyerInfos = createLevelStore('buyer_infos');
export const buyerInfoPerOrder = createLevelStore('buyer_info_per_order');
export const notariesCache = createRedisStore('notaries.cache');
export const notarizationRequests = createRedisStore('notarization_requests');
/** @type {LevelStore<string, number>} */
export const sellers = createLevelStore('sellers');
/** @type {LevelStore<number, OrderStats[]>} */
export const orderStats = createLevelStore('order_stats');
