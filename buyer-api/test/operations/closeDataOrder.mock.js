import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const dataOrders = { update: sinon.spy() };
td.replace('../../src/utils/stores', { dataOrders });
export const addTransactionJob = sinon.spy();
td.replace('../../src/queues/transactionQueue', { addTransactionJob });

test.afterEach(sinon.reset);
