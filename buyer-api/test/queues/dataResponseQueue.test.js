import { serial as it } from 'ava';
import {
  done,
  dataResponses,
  dataResponsesAccumulator as accumulator,
  dataResponsesBatches as batches,
  addPrepareNotarizationJob,
} from './dataResponseQueue.mock';
import { processDataResponseJob } from '../../src/queues/dataResponseQueue';

const job = {
  data: {
    orderId: 42,
    price: 65,
    dataResponseId: '42:0xa42df59C5e17df255CaDfF9F52a004221f774f36',
    batchSize: 10,
  },
};

it('accumulates the DataResponse', async (assert) => {
  const { status } = await processDataResponseJob(job, done);
  assert.snapshot(accumulator.store.lastCall.args, { id: 'accumulator.store().args' });
  assert.false(batches.store.called);
  assert.false(addPrepareNotarizationJob.called);
  assert.snapshot(dataResponses.store.lastCall.args, { id: 'dataResponses.store().args' });
  assert.is(status, 'batched');
});

it('adds a job to prepare the notarization', async (assert) => {
  const { status } = await processDataResponseJob(
    {
      data: {
        ...job.data,
        batchSize: 1,
      },
    },
    done,
  );
  assert.snapshot(batches.store.lastCall.args, { id: 'batches.store().args' });
  assert.snapshot(addPrepareNotarizationJob.lastCall.args, { id: 'addPrepareNotarizationJob().args' });
  assert.snapshot(dataResponses.store.lastCall.args, { id: 'dataResponses.store().args' });
  assert.is(status, 'batched');
});

it('does not add the DataResponse to a batch when the status is other than queued', async (assert) => {
  dataResponses.fetch.returns({ status: 'waiting' });
  const { status } = await processDataResponseJob(job, done);
  assert.false(accumulator.store.called);
  assert.false(batches.store.called);
  assert.false(addPrepareNotarizationJob.called);
  assert.is(status, 'waiting');
});
