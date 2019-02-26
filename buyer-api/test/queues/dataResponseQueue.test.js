import { serial as it } from 'ava';
import {
  done,
  dataResponses,
  dataResponsesAccumulator as accumulator,
  dataResponsesBatches as batches,
  addPrepareNotarizationJob,
  notaryAddress,
  fakeQueue,
} from './dataResponseQueue.mock';
import { processDataResponseJob, sendNotarizationBatchJob, selectJobType } from '../../src/queues/dataResponseQueue';

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
  assert.false(fakeQueue.add.called);
  assert.snapshot(dataResponses.store.lastCall.args, { id: 'dataResponses.store().args' });
  assert.is(status, 'batched');
});

it('adds a job to send the notarization batch', async (assert) => {
  const { status } = await processDataResponseJob(
    {
      data: {
        ...job.data,
        batchSize: 1,
      },
    },
    done,
  );
  assert.snapshot(fakeQueue.add.lastCall.args, { id: 'addProcessDataResponseJob().args' });
  assert.snapshot(dataResponses.store.lastCall.args, { id: 'dataResponses.store().args' });
  assert.is(status, 'batched');
});

it('adds a job to prepare the notarization', async (assert) => {
  accumulator.fetch.returns(['42:0xa42df59C5e17df255CaDfF9F52a004221f774f36']);
  await sendNotarizationBatchJob(
    {
      data: {
        ...job.data,
        notaryAddress,
      },
    },
    done,
  );
  assert.snapshot(batches.store.lastCall.args, { id: 'batches.store().args' });
  assert.snapshot(addPrepareNotarizationJob.lastCall.args, { id: 'addPrepareNotarizationJob().args' });
});

it('selectJobType launchs sendNotarizationBatchJob', async (assert) => {
  accumulator.fetch.returns(['42:0xa42df59C5e17df255CaDfF9F52a004221f774f36']);
  await selectJobType(
    {
      data: {
        ...job.data,
        notaryAddress,
        type: 'sendNotarizationBatch',
      },
    },
    done,
  );
  assert.snapshot(batches.store.lastCall.args, { id: 'batches.store().args' });
  assert.snapshot(addPrepareNotarizationJob.lastCall.args, { id: 'addPrepareNotarizationJob().args' });
});

it('selectJobType launchs processDataResponseJob', async (assert) => {
  const { status } = await selectJobType(
    {
      data: {
        ...job.data,
        notaryAddress,
        type: 'processDataResponse',
      },
    },
    done,
  );
  assert.snapshot(accumulator.store.lastCall.args, { id: 'accumulator.store().args' });
  assert.false(fakeQueue.add.called);
  assert.snapshot(dataResponses.store.lastCall.args, { id: 'dataResponses.store().args' });
  assert.is(status, 'batched');
});

const dontAddJob = async (assert, localJob) => {
  const { status } = await processDataResponseJob(localJob, done);
  assert.false(accumulator.store.called);
  assert.false(fakeQueue.add.called);
  assert.is(status, 'waiting');
};

it('does not add the DataResponse to a batch when the status is other than queued', async (assert) => {
  dataResponses.fetch.returns({ status: 'waiting' });
  dontAddJob(assert, job);
});

it('does not add the DataResponse to a batch if batchSize = -1', async (assert) => {
  const otherJob = {
    data: {
      ...job.data,
      batchSize: -1,
    },
  };
  dontAddJob(assert, otherJob);
});
