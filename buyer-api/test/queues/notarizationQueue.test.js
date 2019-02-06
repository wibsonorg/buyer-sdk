import { serial as it } from 'ava';
import {
  notarizations,
  notarizationQueue,
  dataResponsesBatches as batches,
  notaries,
  notarize,
} from './notarizationQueue.mock';
import { prepare, request } from '../../src/queues/notarizationQueue';

const job = {
  data: {
    batchId: 'batch1',
  },
};

it('prepare > creates the NotarizationRequest', async (assert) => {
  await prepare(job);
  assert.snapshot(notarizationQueue.add.lastCall.args, { id: 'notarizationQueue.add().args' });
  assert.snapshot(notarizations.store.lastCall.args, { id: 'notarizations.store().args' });
  assert.snapshot(batches.store.lastCall.args, { id: 'batches.store().args' });
});

it('prepare > does not create the NotarizationRequest when Batch status is other than created', async (assert) => {
  batches.fetch.returns({ status: 'other-status' });
  await prepare(job);
  assert.false(notarizationQueue.add.called);
  assert.false(notarizations.store.called);
  assert.false(batches.store.called);
});

it('request > sends the NotarizationRequest', async (assert) => {
  await request({ data: { notarizationRequestId: 'not-req-id' }});
  assert.snapshot(notarize.lastCall.args, { id: 'notarize().args' });
  const [id, { status }] = notarizations.update.lastCall.args;
  assert.is(id, 'not-req-id');
  assert.is(status, 'requested');
});
