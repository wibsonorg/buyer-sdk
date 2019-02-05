import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const notarizationRequests = { put: sinon.spy() };
td.replace('../../src/utils/stores', { notarizationRequests });
export const addNotarizacionResultJob = sinon.spy();
td.replace('../../src/queues/tranferNotarizationResultQueue', { addNotarizacionResultJob });

test.afterEach(sinon.reset);
