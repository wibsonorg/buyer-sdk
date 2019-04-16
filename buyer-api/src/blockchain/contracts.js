import abiDecoder from 'abi-decoder';
import { web3 } from '../utils';
import config from '../../config';

import WibcoinDefinition from '../../contracts/WIBToken.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';
import BatPayDefinition from '../../contracts/BatPay.json';

const { wibcoin, dataExchange, batPay } = config.contracts.addresses;
const { Contract, getTransaction, getTransactionReceipt } = web3.eth;

const toObject = arr => arr.reduce((obj, { name, value }) => ({ ...obj, [name]: value }), {});
const createContract = ({ abi }, address) => {
  abiDecoder.addABI(abi);
  return new Contract(abi, address);
};

export const Wibcoin = createContract(WibcoinDefinition, wibcoin);
export const DataExchange = createContract(DataExchangeDefinition, dataExchange);
export const BatPay = createContract(BatPayDefinition, batPay);

export const toDate = ts => (ts > 0 ? new Date(ts * 1000).toISOString() : null);
export async function fetchTxData(e) {
  const { input } = await getTransaction(e.transactionHash || e);
  return toObject(abiDecoder.decodeMethod(input).params);
}
export async function fetchTxLogs(e) {
  const { logs } = await getTransactionReceipt(e.transactionHash || e);
  return toObject(abiDecoder.decodeLogs(logs)[0].events);
}

/**
 * @function getElements
 * @param {Object} contract the instance of the truffle contract to consult.
 * @param {String} property The property name to get the list from.
 * @returns {Array} An array of elements stored in the property.
 */
export async function getElements(contract, property, start = 0) {
  if (!contract) throw new Error('Contract must exist');
  const elements = [];
  const getElement = i => contract.methods[property](i).call();
  try {
    let e = await getElement(0);
    for (let i = start; e && e !== '0x'; i += 1) {
      /* eslint-disable no-await-in-loop */
      elements.push(e);
      e = await getElement(i);
    }
  } catch (_) {
    /**/
  }
  return elements;
}
