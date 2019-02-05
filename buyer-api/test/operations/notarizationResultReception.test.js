import test from 'ava';
import { addTransactionJob } from './notarizationResultReception.mock';
import { receiveNotarizationResult } from '../../src/operations/notarizationResultReception';
import {
  someNotarizationRequest,
  someNotarizationResult,
  someNotarizationResultWithDuplicatedAddresses,
  someNotarizationResultWithNonRequestedAddresses,
} from './notarizationResultReception.fixture';

const it = test.serial;

it('call receiveNotarizationResult', async (assert) => {
  receiveNotarizationResult(
    someNotarizationRequest,
    someNotarizationResult,
  );
  assert.snapshot(addTransactionJob.lastCall.args);
});

it('call receiveNotarizationResult with not requested addresses', async (assert) => {
  receiveNotarizationResult(
    someNotarizationRequest,
    someNotarizationResultWithNonRequestedAddresses,
  );
  assert.is(addTransactionJob.lastCall.lastArg.sellers.length, 2);
});

it('call receiveNotarizationResult with duplicated addresses', async (assert) => {
  receiveNotarizationResult(
    someNotarizationRequest,
    someNotarizationResultWithDuplicatedAddresses,
  );
  assert.is(addTransactionJob.lastCall.lastArg.sellers.length, 2);
});
