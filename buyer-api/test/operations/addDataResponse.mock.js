import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const putData = sinon.spy();
td.replace('../../src/utils/wibson-lib/s3', { putData });
export const dataResponses = { store: sinon.spy(), safeFetch: sinon.stub(), update: sinon.spy() };
td.replace('../../src/utils/stores', { dataResponses });
export const addProcessDataResponseJob = sinon.spy();
td.replace('../../src/queues/dataResponseQueue', { addProcessDataResponseJob });

test.afterEach(sinon.reset);
