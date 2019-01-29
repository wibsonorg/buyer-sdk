import { serial as it } from 'ava';
import {
  done,
  dataResponses,
  dataResponsesBatches,
  addPrepareNotarizationJob,
} from './dataResponseQueue.mock';
import { processDataResponseJob } from '../../src/queues/dataResponseQueue';

const job = {
  data: {
    orderId: 42,
    dataResponseId: '42:0xa42df59C5e17df255CaDfF9F52a004221f774f36',
    maximumBatchSize: 10,
  },
};

it('adds the DataResponse to a batch', async (assert) => {
  const { status } = await processDataResponseJob(job, done);
  assert.snapshot(dataResponsesBatches.store.lastCall.args);
  assert.false(addPrepareNotarizationJob.called);
  assert.is(status, 'batched');
});

it('adds a job to prepare the notarization', async (assert) => {
  const { status } = await processDataResponseJob(
    {
      data: {
        ...job.data,
        maximumBatchSize: 1,
      },
    },
    done,
  );
  assert.snapshot(dataResponsesBatches.store.lastCall.args);
  assert.snapshot(addPrepareNotarizationJob.lastCall.args);
  assert.is(status, 'batched');
});

it('does not add the DataResponse to a batch when the status is other than queued', async (assert) => {
  dataResponses.fetch.returns({ status: 'waiting' });
  const { status } = await processDataResponseJob(job, done);
  assert.false(dataResponsesBatches.store.called);
  assert.false(addPrepareNotarizationJob.called);
  assert.is(status, 'waiting');
});
