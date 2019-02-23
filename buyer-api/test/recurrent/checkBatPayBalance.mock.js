import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const config = {
  balance: { minBatPay: '100' },
  checkBatPayBalance: { interval: 10000, multiplier: 5 },
};
td.replace('../../config', config);

export const hasEnoughBatPayBalance = sinon.stub();
td.replace('../../src/blockchain/balance', { hasEnoughBatPayBalance });
export const addTransactionJob = sinon.spy();
td.replace('../../src/queues/transactionQueue', { addTransactionJob });
export const getAccount = sinon.stub();
td.replace('../../src/services/signingService', { getAccount });
td.replace('../../src/utils/stores', {});

export const buyerAddress = '0xBuyerAddress';
export const batPayAddress = '0xBatPayAddress';
export const BatPay = {
  options: {
    address: batPayAddress,
  },
};
td.replace('../../src/blockchain/contracts', { BatPay });

test.beforeEach(() => {
  hasEnoughBatPayBalance.returns(false);
  getAccount.returns({ address: buyerAddress })
});
test.afterEach(sinon.reset);
