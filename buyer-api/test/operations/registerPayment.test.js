import { serial as it } from 'ava';
import { addTransactionJob, hasEnoughBatPayBalance, fakePauseQueue } from './registerPayment.mock';
import { registerPayment } from '../../src/operations/registerPayment';

it('adds a transaction job', async (assert) => {
  await registerPayment('not-req-id');
  assert.snapshot(addTransactionJob.lastCall.args, { id: 'addTransactionJob().args' });
});

it("if account's balance in BatPay is less than the amount to pay, register payments queue will be paused", async (assert) => {
  hasEnoughBatPayBalance.returns(false);
  await registerPayment('not-req-id', fakePauseQueue);
  assert.true(fakePauseQueue.called);
});
