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
    price: 6000,
  }),
};

export const currentPaymentsAmount = {
  safeFetch: sinon.stub(),
  update: sinon.stub(),
};
td.replace('../../src/utils/stores', { dataOrders, notarizations, currentPaymentsAmount });

export const packPayData = sinon.stub().returns('0xff04+SomePayDataPack');
td.replace('../../src/blockchain/batPay', { packPayData });

export const fromWib = sinon.stub().returns('6000000000000');
td.replace('../../src/utils/wibson-lib/coin', { fromWib });

export const hasEnoughBatPayBalance = sinon.stub().resolves(true);
td.replace('../../src/blockchain/balance', {
  hasEnoughBatPayBalance,
});

const queue = { pause: sinon.stub() };
export const fakePauseQueue = sinon.stub().resolves(queue.pause());

export const web3 = {
  utils: {
    toBN: () => ({ muln: sinon.stub().returns({ add: sinon.stub() }) }),
  },
};

export const logger = {
  info: sinon.stub(),
};

td.replace('../../src/utils', { web3, logger });

test.afterEach(sinon.resetHistory);
