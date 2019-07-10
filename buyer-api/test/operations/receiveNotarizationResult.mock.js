import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { someNotarizationRequest } from './receiveNotarizationResult.fixture';

const clock = sinon.useFakeTimers();
export const {
  notarizations,
  notarizationsPerLockingKeyHash,
} = td.replace('../../src/utils/stores', {
  notarizations: { safeFetch: sinon.stub(), store: sinon.spy() },
  notarizationsPerLockingKeyHash: { store: sinon.spy() },
});
export const addRegisterPaymentJob = sinon.spy();
td.replace('../../src/queues/registerPaymentsQueue', { addRegisterPaymentJob });

test.beforeEach(() => {
  notarizations.safeFetch.withArgs('1').returns({ request: someNotarizationRequest });
});
test.afterEach(() => {
  sinon.reset();
  clock.reset();
});
