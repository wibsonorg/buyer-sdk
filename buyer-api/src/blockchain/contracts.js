import { web3 } from '../utils';
import config from '../../config';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';
import BatPayDefinition from '../../contracts/BatPay.json';

const { Contract } = web3.eth;
const { wibcoin, dataExchange, batPay } = config.contracts.addresses;

export const Wibcoin = new Contract(WibcoinDefinition.abi, wibcoin);
export const DataExchange = new Contract(DataExchangeDefinition.abi, dataExchange);
export const BatPay = new Contract(BatPayDefinition.abi, batPay);
