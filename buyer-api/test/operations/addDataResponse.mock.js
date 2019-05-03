import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const putData = sinon.spy();
td.replace('../../src/utils/wibson-lib/s3', { putData });
export const dataResponses = { store: sinon.spy(), safeFetch: sinon.stub() };
export const sellers = { safeFetch: sinon.stub(), put: sinon.spy() };
td.replace('../../src/utils/stores', { dataResponses, sellers });
export const addProcessDataResponseJob = sinon.spy();
td.replace('../../src/queues/dataResponseQueue', { addProcessDataResponseJob });

test.beforeEach(() => {
  sellers.safeFetch.withArgs('0xa42df59C5e17df255CaDfF9F52a004221f774f36').returns(1085);
  sellers.safeFetch.withArgs(undefined).returns(null);
});

test.afterEach(sinon.reset);
