import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { someNotarizationRequest } from './receiveNotarizationResult.fixture';

const clock = sinon.useFakeTimers();
export const notarizations = { safeFetch: sinon.stub(), store: sinon.spy() };
td.replace('../../src/utils/stores', { notarizations });
export const addRegisterPaymentJob = sinon.spy();
td.replace('../../src/queues/registerPaymentsQueue', { addRegisterPaymentJob });

test.beforeEach(() => {
  notarizations.safeFetch.withArgs('1').returns({ request: someNotarizationRequest });
});
test.afterEach(() => {
  sinon.reset();
  clock.reset();
});
