import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const { dataOrders } = td.replace('../../../src/utils/stores', {
  dataOrders: {
    update: sinon.spy(), store: sinon.spy(), fetch: sinon.stub(),
  },
});
export const { fetchDataOrder } = td.replace('../../../src/blockchain/dataOrder', {
  fetchDataOrder: sinon.stub().resolves({ id: '2', buyerUrl: '/orders/2/offchain-data' }),
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
