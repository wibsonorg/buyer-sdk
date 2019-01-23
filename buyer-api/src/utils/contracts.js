import web3 from './web3';
import config from '../../config';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';

const wibcoinAt = address =>
  new web3.eth.Contract(WibcoinDefinition.abi, address);
const dataExchangeAt = address =>
  new web3.eth.Contract(DataExchangeDefinition.abi, address);

const wibcoin = wibcoinAt(config.contracts.addresses.wibcoin);
const dataExchange = dataExchangeAt(config.contracts.addresses.dataExchange);

// TODO: remove this contract (deprecated)
const dataOrderAt = () => 0;
export {
  wibcoin,
  dataExchange,
  dataOrderAt,
};
