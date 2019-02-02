import { BigNumber } from 'bignumber.js';

import web3 from './web3';
import config from '../../config';
import { toWib } from './wibson-lib/coin';

import DataExchangeDefinition from '../../contracts/DataExchange.json';

const { dataExchange } = config.contracts.addresses;
const dx = new web3.eth.Contract(DataExchangeDefinition.abi, dataExchange);

const toDate = ts => (ts > 0 ? new Date(ts * 1000).toISOString() : null);

/**
 * @typedef BlockchainEvent An event on the blockchain
 * @property {string} event Name of this event
 * @property {?number} blockNumber Block number this event was registered on
 * @property {Object<string, *>} returnValues Values emitted by the event

 * @function fetchDataExchangeEvents Fetches all events on the DataExchange
 * @param {Number} fromBlock Starting block to get events from the DataExchange
 * @returns {Promise<BlockchainEvent[]>} An array of events from the DataExchange
 */
export const fetchDataExchangeEvents = async fromBlock => (
  await dx.getPastEvents('allEvents', { fromBlock })
).filter(event => Number(event.blockNumber) > 0);

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
    } = await dx.methods.dataOrders(dxId).call();
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
 * based on https://github.com/wibsonorg/BatchPayments/blob/0fd011b3ff7f078a449913cce47f2d1b954f8fcb/lib/utils.js#L66
 * @param {[NumberLike]} list - ids to hash
 */
export function getPayData(list) {
  const hex = x => (`00${x.toString(16)}`).substr(-2);
  const bytesPerId = 4;

  list.sort((a, b) => a - b);

  let last = 0;
  let data = '';

  for (let i = 0; i < list.length; i += 1) {
    let delta = list[i] - last;

    let number = '';
    for (let j = 0; j < bytesPerId; j += 1) {
      number = hex(delta % 256) + number;
      delta = Math.trunc(delta / 256);
    }

    data += number;
    last = list[i];
  }

  const hexNumber = `0xff${hex(bytesPerId)}${data}`;
  const bigNumber = new BigNumber(hexNumber);

  // console.log('toBigNumber', web3.toBigNumber(hexNumber));
  console.log('toBigNumber', bigNumber);

  return bigNumber;
}
