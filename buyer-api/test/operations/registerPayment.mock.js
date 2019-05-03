import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { someNotarizationResult } from './receiveNotarizationResult.fixture';

export const config = td.replace('../../config', { batPayId: 13 });

export const addTransactionJob = sinon.spy();
td.replace('../../src/queues/transactionQueue', { addTransactionJob });

export const notarizations = {
  fetch: sinon
    .stub()
    .withArgs('not-req-id')
    .returns({
      result: someNotarizationResult,
    }),
};
export const dataOrders = {
  fetchByDxId: sinon.stub().resolves({
    transactionHash: '0xSomeDataOrderCreationHash',
    price: 6,
  }),
};
td.replace('../../src/utils/stores', { dataOrders, notarizations });

export const packPayData = sinon.stub().returns('0xff04+SomePayDataPack');
td.replace('../../src/blockchain/batPay', { packPayData });

export const fromWib = sinon.stub().returns('6000000000');
td.replace('../../src/utils/wibson-lib/coin', { fromWib });

test.afterEach(sinon.resetHistory);
