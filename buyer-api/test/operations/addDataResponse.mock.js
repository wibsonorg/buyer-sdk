import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const dataResponses = { store: sinon.spy(), safeFetch: sinon.stub() };
td.replace('../../src/utils/stores', { dataResponses });
export const addProcessDataResponseJob = sinon.spy();
td.replace('../../src/queues/dataResponseQueue', { addProcessDataResponseJob });

test.afterEach(sinon.reset);
