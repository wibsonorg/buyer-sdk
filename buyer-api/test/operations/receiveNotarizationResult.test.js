import test from 'ava';
import { notarizations, addNotarizationResultJob } from './receiveNotarizationResult.mock';
import { receiveNotarizationResult } from '../../src/operations/receiveNotarizationResult';
import {
  someNotarizationResult,
  someNotarizationResultWithDuplicatedAddresses,
  someNotarizationResultWithNonRequestedAddresses,
} from './receiveNotarizationResult.fixture';

const it = test.serial;

it('enqueues correct list of sellers for NotarizationResult', async (assert) => {
  await receiveNotarizationResult(
    '1',
    someNotarizationResult,
  );
  assert.snapshot(addNotarizationResultJob.lastCall.args, { id: 'addNotarizationResultJob().args' });
});

it('filters not requested addresses', async (assert) => {
  await receiveNotarizationResult(
    '1',
    someNotarizationResultWithNonRequestedAddresses,
  );
  assert.snapshot(notarizations.store.lastCall.args, { id: 'notarizations.store().args with non-requested addresses' });
});

it('filters duplicated addresses', async (assert) => {
  await receiveNotarizationResult(
    '1',
    someNotarizationResultWithDuplicatedAddresses,
  );
  assert.snapshot(notarizations.store.lastCall.args, { id: 'notarizations.store().args with duplicated addresses' });
});

it('throws exception on non-existent request', async (assert) => {
  const error = await assert.throwsAsync(receiveNotarizationResult('2', someNotarizationResult));
  assert.is(error.message, 'Notarization request not found');
});
