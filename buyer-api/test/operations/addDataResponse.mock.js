import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const storeDataResponse = sinon.spy();
td.replace('../../src/utils/stores', { storeDataResponse });
export const addProcessDataResponseJob = sinon.spy();
td.replace('../../src/queues/dataResponseQueue', { addProcessDataResponseJob });

test.afterEach(sinon.reset);
