import web3 from './web3';
import config from '../../config';
import { toWib } from './wibson-lib/coin';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';

const { wibcoin, dataExchange } = config.contracts.addresses;
const wib = new web3.eth.Contract(WibcoinDefinition.abi, wibcoin);
const dx = new web3.eth.Contract(DataExchangeDefinition.abi, dataExchange);

const toDate = ts => (ts > 0 ? new Date(ts * 1000).toISOString() : null);

/**
 * @function fetchDataExchangeEvents
 * @param {Number} fromBlock Starting block to get events from the data exchange.
 * @returns {DataOrder} An array of elements stored in the property.
 */
export const fetchDataExchangeEvents = async fromBlock => (
  await dx.getPastEvents('allEvents', { fromBlock })
).filter(event => Number(event.blockNumber) > 0);

/**
 * @typedef DataOrder
 * @property {string} buyer
 * @property {Object.<string, *>} audience
 * @property {string[]} requestedData
 * @property {string} termsAndConditionsHash
 * @property {string} buyerUrl
 * @property {Date} createdAt
 * @property {?Date} closedAt
 */

/**
 * @function fetchDataOrder
 * @param {Number} id Data order id on the data exchange.
 * @returns {DataOrder} An array of elements stored in the property.
 */
export function fetchDataOrder(id) {
  if (id > 0) {
    const dataOrder = dx.methods.dataOrders(id).call();
    return {
      ...dataOrder,
      buyer: dataOrder.buyer.toLowerCase(),
      audience: JSON.parse(dataOrder.audience),
      price: toWib(dataOrder.price),
      requestedData: JSON.parse(dataOrder.requestedData),
      createdAt: toDate(dataOrder.createdAt),
      closedAt: toDate(dataOrder.closedAt),
    };
  }
  throw new Error('Invalid Id');
}
