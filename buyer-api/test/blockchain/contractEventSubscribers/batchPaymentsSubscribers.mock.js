import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';


export const orderStats = { update: sinon.spy() };

export const lockingKeyHash = 'alockingkeyhash123';
export const notarizationId = 43444;
export const transactionHash = 'atransactionhash124';

export const paymentsTransactionHashes = {
  store: sinon.spy(),
  safeFetch: sinon.stub().returns(transactionHash),
};
export const notarizationsPerLockingKeyHash = {
  fetch: sinon.spy(async () => Promise.resolve(notarizationId)),
};
export const notarizations = { update: sinon.spy() };

td.replace('../../../src/utils/stores', {
  orderStats, paymentsTransactionHashes, notarizationsPerLockingKeyHash, notarizations,
});
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

export const fetchTxData = sinon.spy(async () => ({ lockingKeyHash }));

td.replace('../../../src/blockchain/contracts', { BatPay, decodeLogs, fetchTxData });

export const web3 = {
  eth: {
    getTransaction: sinon.spy(() => ({
      gasPrice: gasPriceTest,
      lockingKeyHash,
    })),
    getTransactionReceipt: sinon.stub().resolves({ gasUsed: gasUsedTest, logs: 'some-logs' }),
  },
};
td.replace('../../../src/utils/web3', web3);

test.beforeEach(() => {
  BatPay.methods.payments.returns({ call: sinon.stub().resolves({ metadata: 'metadata!' }) });
});
test.afterEach(sinon.reset);

// mock decrypt job queue addition
export const addDecryptJob = sinon.stub();
td.replace('../../../src/queues/decryptSellerKeys', { addDecryptJob });
