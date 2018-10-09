import web3 from './web3';
import config from '../../config';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataOrderDefinition from '../../contracts/DataOrder.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';

const WibcoinContract = web3.eth.contract(WibcoinDefinition.abi);
const DataOrderContract = web3.eth.contract(DataOrderDefinition.abi);
const DataExchangeContract = web3.eth.contract(DataExchangeDefinition.abi);

const wibcoin = WibcoinContract.at(config.contracts.addresses.wibcoin);
const dataExchange = DataExchangeContract.at(config.contracts.addresses.dataExchange);

export {
  wibcoin,
  WibcoinContract,
  DataOrderContract,
  dataExchange,
  DataExchangeContract,
};
