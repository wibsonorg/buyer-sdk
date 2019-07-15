import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

sinon.useFakeTimers(new Date('2019/02/19 10:20 GMT'));

td.replace('uuid/v4', () => 'uuid');
td.replace('../../src/utils/wibson-lib/coin', { fromWib: () => 'wibTokens' });
export const getBuyerInfo = sinon.stub();
td.replace('../../src/services/buyerInfo', { getBuyerInfo });
export const { dataOrders, notaries } = td.replace('../../src/utils/stores', {
  dataOrders: { store: sinon.spy() },
  notaries: { fetch: sinon.spy() },
});
export const addTransactionJob = sinon.spy();
td.replace('../../src/queues/transactionQueue', { addTransactionJob });

test.beforeEach(() => {
  getBuyerInfo.returns(Promise.resolve({ termsHash: '0xSomeHash' }));
});
test.afterEach(sinon.reset);
