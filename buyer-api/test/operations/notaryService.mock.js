import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { someNotarizationResult } from './notaryService.fixture';

const web3 = {
  eth: {
    Contract: sinon.stub(),
  },
  utils: {
    numberToHex: () => 'hex',
    sha3: () => 'hash',
  },
};
td.replace('../../src/utils/web3', web3);
const config = {
  contracts: {
    addresses: {
      dataExchange: '0x7dD7c3400E01Af4238CEd5BF8AE6eFBCC5a46E6f',
    },
  },
};
td.replace('../../config', config);

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
  notarizations.fetch.withArgs('not-req-id').returns({
    price: fakeDataOrder.price,
    result: someNotarizationResult,
  });
  dataOrders.fetch.resolves(fakeDataOrder);
});
test.afterEach(sinon.reset);
