import { DataExchange, toDate } from './contracts';
import { toWib } from '../utils/wibson-lib/coin';

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
 * @param {Number} orderId Data order id on the data exchange
 * @returns {Promise<DataOrder>} DataOrder information on the DataExchange
 */
export async function fetchDataOrder(orderId) {
  const [
    buyer,
    audience,
    price,
    requestedData,
    termsAndConditionsHash,
    buyerUrl,
    createdAt,
    closedAt,
  ] = Object.values(await DataExchange.methods.getDataOrder(orderId).call());
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
