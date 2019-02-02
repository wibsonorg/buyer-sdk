import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const enqueueTransaction = sinon.spy();
td.replace('../../src/queues/transactionQueue', { enqueueTransaction });

export const getAccount = sinon.stub();
td.replace('../../src/services/signingService', { getAccount });
export const dataOrders = {
  fetch: sinon.stub(),
  store: sinon.stub(),
};
td.replace('../../src/utils/stores', { dataOrders });

export const fakeAccount = { address: 'some-buyer-address', id: 667 };
export const fakeDataOrder = {
  id: 'some-uuid',
  audience: { age: 42 },
  price: 999,
  requestedData: ['some-data-type-id'],
  termsAndConditionsHash: '0xSomeTermsAndConditionsHash',
  buyerUrl: 'someBuyerUrl/orders/some-uuid/offchain-data',
};
test.beforeEach(() => {
  getAccount.resolves(fakeAccount);
  dataOrders.fetch.resolves(fakeDataOrder);
});
test.afterEach(sinon.resetHistory);
