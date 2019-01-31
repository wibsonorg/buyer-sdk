import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const apicache = td.replace('apicache', { clear: sinon.spy() });
export const getAccount = sinon.stub();
td.replace('../../src/services/signingService', { getAccount });
export const fetchDataOrder = sinon.stub();
td.replace('../../src/utils/blockchain', { fetchDataOrder });
export const dataOrders = {
  fetch: sinon.stub(),
  store: sinon.stub(),
};
td.replace('../../src/utils/stores', { dataOrders });

export const fakeAccount = { address: '0xSomeBuyerAddress' };
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
  fetchDataOrder.resolves(fakeDataOrder);
});
test.afterEach(sinon.resetHistory);
