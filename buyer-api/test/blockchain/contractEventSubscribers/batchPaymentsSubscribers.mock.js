import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const orderStats = { update: sinon.spy() };
td.replace('../../../src/utils/stores', { orderStats });
td.replace('../../../src/utils/jobify', { jobify: sinon.stub() });
td.replace('../../../config', { batPayId: 16 });

export const orderIdTest = '9';
export const gasPriceTest = '12345';
export const gasUsedTest = '3000';

const BatPay = {
  methods: {
    payments: sinon.stub(),
  },
};
const decodeLogs = sinon.stub().resolves({ orderId: orderIdTest });

const fetchTxData = sinon.stub().resolves(undefined);

td.replace('../../../src/blockchain/contracts', { BatPay, decodeLogs, fetchTxData });

const web3 = {
  eth: {
    getTransaction: sinon.stub().resolves({ gasPrice: gasPriceTest }),
    getTransactionReceipt: sinon.stub().resolves({ gasUsed: gasUsedTest, logs: 'some-logs' }),
  },
};
td.replace('../../../src/utils/web3', web3);

test.beforeEach(() => {
  BatPay.methods.payments.returns({ call: sinon.stub().resolves({ metadata: 'metadata!' }) });
});
test.afterEach(sinon.reset);
