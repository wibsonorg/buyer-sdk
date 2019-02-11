import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { someNotarizationRequest } from './receiveNotarizationResult.fixture';

export const getNotarizationRequest = sinon.stub();
td.replace('../../src/facades', { getNotarizationRequest });
export const addNotarizacionResultJob = sinon.spy();
td.replace('../../src/queues/tranferNotarizationResultQueue', { addNotarizacionResultJob });

function returnRequest(id) {
  if (id === '1') return someNotarizationRequest;
  return null;
}

test.beforeEach(() => {
  getNotarizationRequest.callsFake(returnRequest);
});
test.afterEach(sinon.reset);
