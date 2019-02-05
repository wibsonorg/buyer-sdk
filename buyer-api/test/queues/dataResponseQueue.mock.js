import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

td.replace('uuid/v4', () => 'uuid');
export const done = sinon.spy();
export const dataResponses = { fetch: sinon.stub(), store: sinon.spy() };
export const dataResponsesAccumulator = { safeFetch: sinon.stub(), store: sinon.spy() };
export const dataResponsesBatches = { safeFetch: sinon.stub(), store: sinon.spy() };
td.replace('../../src/utils/stores', {
  dataResponses,
  dataResponsesAccumulator,
  dataResponsesBatches,
});

const fakeQueue = { process: sinon.stub(), on: sinon.stub() };
export const createQueue = sinon.stub().returns(fakeQueue);
td.replace('../../src/queues/createQueue', { createQueue });

export const addPrepareNotarizationJob = sinon.spy();
td.replace('../../src/queues/notarizationQueue', { addPrepareNotarizationJob });

test.beforeEach(() => {
  dataResponses.fetch.returns({
    status: 'queued',
    notaryAddress: '0xcccf90140fcc2d260186637d59f541e94ff9288f',
  });
  dataResponsesAccumulator.safeFetch.returns([]);
  dataResponsesBatches.safeFetch.returns([]);
});
test.afterEach(sinon.reset);
