import test from 'ava';
import sinon from 'sinon';
import { BigNumber } from 'bignumber.js';
import { checkAllowance } from '../../../src/facades';
import config from '../../../config';
import * as utils from '../../../src/utils';

test.afterEach.always(() => { sinon.restore(); });

test.serial('sends tx if allowance is less than config.minimumAllowance', async (assert) => {
  sinon.stub(utils, 'wibcoin').value({ methods: { allowance: () => ({ call: () => new BigNumber(config.allowance.minimumAllowance - 10) }) } });
  const callback = sinon.spy();
  await checkAllowance(callback);
  assert.is(callback.called, true);
});

test.serial('does not send tx if allowance is greater than config.minimumAllowance', async (assert) => {
  sinon.stub(utils, 'wibcoin').value({ methods: { allowance: () => ({ call: () => new BigNumber(config.allowance.minimumAllowance + 10) }) } });
  const callback = sinon.spy();
  await checkAllowance(callback);
  assert.is(callback.called, false);
});
