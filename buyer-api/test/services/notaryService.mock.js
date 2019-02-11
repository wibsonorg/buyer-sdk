import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { someNotarizationResult } from './notaryService.fixture';

export const addTransactionJob = sinon.spy();
td.replace('../../src/queues/transactionQueue', { addTransactionJob });

export const notarizations = { fetch: sinon.stub() };
export const dataOrders = { fetch: sinon.stub() };
td.replace('../../src/utils/stores', { dataOrders, notarizations });

export const fakeDataOrder = {
  id: 'some-uuid',
  audience: { age: 42 },
  price: 999,
  requestedData: ['some-data-type-id'],
  termsAndConditionsHash: '0xSomeTermsAndConditionsHash',
  buyerUrl: 'someBuyerUrl/orders/some-uuid/offchain-data',
};
test.beforeEach(() => {
  notarizations.fetch.withArgs('not-req-id').returns({ result: someNotarizationResult });
  dataOrders.fetch.resolves(fakeDataOrder);
});
test.afterEach(sinon.reset);
