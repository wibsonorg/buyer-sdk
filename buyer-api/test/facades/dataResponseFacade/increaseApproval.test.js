import test from 'ava';
import sinon from 'sinon';
import { checkAllowance } from '../../../src/facades';
import config from '../../../config';

test.serial('sends tx if allowance is less than config.minimumAllowance', async (assert) => {
  const callback = sinon.spy();
  await checkAllowance(callback);
  assert.is(callback.called, true);
});

test.serial('does not send tx if allowance is greater than config.minimumAllowance', async (assert) => {
  const minimumAllowanceStub = sinon.stub(config.allowance, 'minimumAllowance').value('-1');
  const callback = sinon.spy();
  await checkAllowance(callback);
  assert.is(callback.called, false);
  minimumAllowanceStub.restore();
});
