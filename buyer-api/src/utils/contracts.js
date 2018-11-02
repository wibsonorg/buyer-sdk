import web3 from './web3';
import config from '../../config';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataOrderDefinition from '../../contracts/DataOrder.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';

const wibcoinAt = address =>
  new web3.eth.Contract(WibcoinDefinition.abi, address);
const dataOrderAt = address =>
  new web3.eth.Contract(DataOrderDefinition.abi, address);
const dataExchangeAt = address =>
  new web3.eth.Contract(DataExchangeDefinition.abi, address);

const wibcoin = wibcoinAt(config.contracts.addresses.wibcoin);
const dataExchange = dataExchangeAt(config.contracts.addresses.dataExchange);

export {
  wibcoin,
  dataExchange,
  dataOrderAt,
};
