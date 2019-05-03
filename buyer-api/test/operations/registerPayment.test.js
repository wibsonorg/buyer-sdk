import { serial as it } from 'ava';
import { addTransactionJob } from './registerPayment.mock';
import { registerPayment } from '../../src/operations/registerPayment';

it('adds a transaction job', async (assert) => {
  await registerPayment('not-req-id');
  assert.snapshot(addTransactionJob.lastCall.args, { id: 'addTransactionJob().args' });
});
