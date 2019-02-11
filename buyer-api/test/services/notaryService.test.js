import { serial as it } from 'ava';
import { addTransactionJob } from './notaryService.mock';
import { transferNotarizacionResult } from '../../src/services/notaryService';

it('adds a transaction job', async (assert) => {
  await transferNotarizacionResult('not-req-id');
  assert.snapshot(addTransactionJob.lastCall.args, { id: 'addTransactionJob().args' });
});
