import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

import { mockUpdate } from '../../utils/store.mocks';

export const apicache = td.replace('apicache', {
  clear: sinon.spy(),
});
export const fakeStoredDataOrder = { status: 'created' };
export const { dataOrders } = td.replace('../../../src/utils/stores', {
  dataOrders: { update: mockUpdate(fakeStoredDataOrder) },
});
export const fakeFetchedDataOrder = { id: '2', buyerUrl: '/orders/2/offchain-data' };
export const { fetchDataOrder } = td.replace('../../../src/blockchain/dataOrder', {
  fetchDataOrder: sinon.stub().resolves(fakeFetchedDataOrder),
});
export const { getAccount } = td.replace('../../../src/services/signingService', {
  getAccount: sinon.stub(),
});

export const { DataExchange, WIBToken } = td.replace('../../../src/blockchain/contracts', {
  DataExchange: sinon.spy(),
  WIBToken: sinon.spy(),
});
export const { jobify } = td.replace('../../../ssrc/utils/jobify', {
  jobify: sinon.spy(),
});


test.afterEach(sinon.resetHistory);
