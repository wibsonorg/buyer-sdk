// TODO: DEPRECATED This should be removed in favor of src/utils/blockchain.js

import config from '../../config';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';

const { wibcoin: wib, dataExchange: dx } = config.contracts.addresses;
export const wibcoin = new web3.eth.Contract(WibcoinDefinition.abi, wib);
export const dataExchange = new web3.eth.Contract(DataExchangeDefinition.abi, dx);

// TODO: remove this contract (deprecated)
export const dataOrderAt = () => 0;
