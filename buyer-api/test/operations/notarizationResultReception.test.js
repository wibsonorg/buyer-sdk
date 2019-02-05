import test from 'ava';
import { addNotarizacionResultJob } from './notarizationResultReception.mock';
import { notarizationResultReception } from '../../src/operations/notarizationResultReception';
import {
  someNotarizationRequest,
  someNotarizationResult,
  someNotarizationResultWithDuplicatedAddresses,
  someNotarizationResultWithNonRequestedAddresses,
} from './notarizationResultReception.fixture';

const it = test.serial;

it('call notarizationResultReception', async (assert) => {
  notarizationResultReception(
    someNotarizationRequest,
    someNotarizationResult,
  );
  assert.snapshot(addNotarizacionResultJob.lastCall.args);
});

it('call notarizationResultReception with not requested addresses', async (assert) => {
  notarizationResultReception(
    someNotarizationRequest,
    someNotarizationResultWithNonRequestedAddresses,
  );
  assert.is(addNotarizacionResultJob.lastCall.lastArg.sellers.length, 2);
});

it('call notarizationResultReception with duplicated addresses', async (assert) => {
  notarizationResultReception(
    someNotarizationRequest,
    someNotarizationResultWithDuplicatedAddresses,
  );
  assert.is(addNotarizacionResultJob.lastCall.lastArg.sellers.length, 2);
});
