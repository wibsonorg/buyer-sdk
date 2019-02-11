import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';

export const config = {
  contracts: {
    addresses: {
      wibcoin: 'someWibcoinAddress',
      dataExchange: 'someDataExchangeddress',
    },
  },
};
td.replace('../../config', config);
export const wibContract = {};
export const dxContract = {
  getPastEvents: sinon.stub(),
  dataOrders: sinon.stub(),
  methods: {},
};
[
  'dataOrders',
].forEach((m) => { dxContract.methods[m] = () => dxContract[m]; });
export const web3 = {
  eth: {
    Contract: sinon.stub()
      .withArgs(WibcoinDefinition, 'someWibcoinAddress')
      .returns(wibContract)
      .withArgs(DataExchangeDefinition, 'someDataExchangeddress')
      .returns(dxContract),
  },
  utils: {
    numberToHex: () => '0x123'
  }
};
td.replace('../../src/utils/web3', web3);

test.afterEach(sinon.reset);
