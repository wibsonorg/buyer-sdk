import test from 'ava';
import { addNotarizacionResultJob } from './notarizationResultReception.mock';
import { receiveNotarizationResult } from '../../src/operations/notarizationResultReception';
import {
  someNotarizationResult,
  someNotarizationResultWithDuplicatedAddresses,
  someNotarizationResultWithNonRequestedAddresses,
} from './notarizationResultReception.fixture';

const it = test.serial;

it('enqueues correct list of sellers for NotarizationResult', async (assert) => {
  receiveNotarizationResult(
    '1',
    someNotarizationResult,
  );
  assert.snapshot(addNotarizacionResultJob.lastCall.args, { id: 'addNotarizacionResultJob().args' });
});

it('filters not requested addresses', async (assert) => {
  receiveNotarizationResult(
    '1',
    someNotarizationResultWithNonRequestedAddresses,
  );
  assert.is(addNotarizacionResultJob.lastCall.lastArg.sellers.length, 2);
});

it('filters duplicated addresses', async (assert) => {
  receiveNotarizationResult(
    '1',
    someNotarizationResultWithDuplicatedAddresses,
  );
  assert.is(addNotarizacionResultJob.lastCall.lastArg.sellers.length, 2);
});

it('call receiveNotarizationResult with non-existent request', async (assert) => {
  assert.throws(() => receiveNotarizationResult(
    '2',
    someNotarizationResult,
  ), 'Notarization request not found');
});
