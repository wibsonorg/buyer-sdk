import apicache from 'apicache';
import { toWib } from '../utils/wibson-lib/coin';
import { DataExchange } from './contracts';
import { toDate } from './utils';
import { contractEventListener } from './contractEventListener';
import { getAccount } from '../services/signingService';
import { dataOrders } from '../utils/stores';

/**
 * @typedef DataOrder DataOrder information on the DataExchange
 * @property {string} buyer Address of the buyer that owns this DataOrder
 * @property {Object<string, *>} audience Target audience
 * @property {number} price Price of the DataOrder
 * @property {string[]} requestedData Requested data types
 * @property {string} termsAndConditionsHash Hash of the terms and conditions
 * @property {string} buyerUrl Url to get extra information
 * @property {Date} createdAt Creation date
 * @property {?Date} closedAt Date of clousure

 * @function fetchDataOrder Fetches a specific DataOrder by dxId
 * @param {Number} dxId Data order id on the data exchange
 * @returns {Promise<DataOrder>} DataOrder information on the DataExchange
 */
export async function fetchDataOrder(dxId) {
  if (dxId > 0) {
    const {
      buyer,
      audience,
      price,
      requestedData,
      termsAndConditionsHash,
      buyerUrl,
      createdAt,
      closedAt,
    } = await DataExchange.methods.dataOrders(dxId).call();
    return {
      buyer: buyer.toLowerCase(),
      audience: JSON.parse(audience),
      price: Number(toWib(price)),
      requestedData: JSON.parse(requestedData),
      termsAndConditionsHash,
      buyerUrl,
      createdAt: toDate(createdAt),
      closedAt: toDate(closedAt),
    };
  }
  throw new Error('Invalid Id');
}

/**
 * @typedef DataOrderEventValues
 * @property {string} owner The buyer that created the DataOrder
 * @property {number} orderId The DataExchange id of the DataOrder

 * @callback dataOrderUpdapter Updates DataOrder in the store with data from the DataExchange
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event

 * @function createDataOrderUpdapter Creates a dataOrderUpdapter with the given status
 * @param {string} status The status to be set by the updater
 * @returns {dataOrderUpdapter}
 */
const createDataOrderUpdapter = status => async ({ owner, orderId: dxId }) => {
  const { address } = await getAccount();
  if (address.toLowerCase() === owner.toLowerCase()) {
    const { buyer, ...chainOrder } = await fetchDataOrder(dxId);
    const id = chainOrder.buyerUrl.match(/\/orders\/(.+)\/offchain-data/)[1];
    const storedOrder = await dataOrders.fetch(id);
    await dataOrders.store(id, {
      ...storedOrder,
      ...chainOrder,
      dxId,
      status,
    });
    apicache.clear('/orders/*');
  }
};

contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', createDataOrderUpdapter('created'))
  .on('DataOrderClosed', createDataOrderUpdapter('closed'));
