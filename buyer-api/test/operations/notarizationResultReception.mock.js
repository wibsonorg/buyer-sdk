import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { someNotarizationRequest } from './notarizationResultReception.fixture';

export const getNotarizationRequest = sinon.stub();
td.replace('../../src/facades', { getNotarizationRequest });
export const notarizationRequests = { put: sinon.spy() };
td.replace('../../src/utils/stores', { notarizationRequests });
export const addTransactionJob = sinon.spy();
td.replace('../../src/queues/transactionQueue', { addTransactionJob });

function returnRequest(id) {
  if (id === '1') return someNotarizationRequest;
  return null;
}

test.beforeEach(() => {
  getNotarizationRequest.callsFake(returnRequest);
});
test.afterEach(sinon.reset);
