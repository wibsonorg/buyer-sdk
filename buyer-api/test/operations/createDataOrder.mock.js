import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

td.replace('uuid/v4', () => 'uuid');
td.replace('../../src/utils/wibson-lib/coin', { fromWib: () => 'wibTokens' });
export const getBuyerInfo = sinon.stub();
td.replace('../../src/services/buyerInfo', { getBuyerInfo });
export const dataOrders = { put: sinon.spy() };
td.replace('../../src/utils/stores', { dataOrders });
export const addTransactionJob = sinon.spy();
td.replace('../../src/queues/transactionQueue', { addTransactionJob });

test.beforeEach(() => {
  getBuyerInfo.returns(Promise.resolve({ termsHash: '0xSomeHash' }));
});
test.afterEach(sinon.reset);
