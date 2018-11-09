import test from 'ava';
import sinon from 'sinon';
import { checkAllowance } from '../../../src/facades';
// import { enqueueTransaction } from '../../../src/queues';

// let app;
test.before(async () => {
  // app = require('../../../src/app'); // eslint-disable-line global-require
});

test('sends tx if allowance is less than config.minimumAllowance', async (assert) => {
  const callback = sinon.spy();
  await checkAllowance(callback);
  assert.is(callback.called, true);
});

test.skip('does not send tx if allowance is greater than config.minimumAllowance', async (assert) => {
  assert.fail();
});
