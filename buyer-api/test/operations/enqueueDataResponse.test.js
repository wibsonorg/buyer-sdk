import { serial as it } from 'ava';
import { dataResponses, addProcessDataResponseJob } from './enqueueDataResponse.mock';
import { enqueueDataResponse } from '../../src/operations/enqueueDataResponse';

it('returns an error when the data response does not exist', async (assert) => {
  const { error, status } = await enqueueDataResponse(2, '2', 2);
  assert.is(status, undefined);
  assert.is(error, 'There\'s not a DataResponse with the data provided');
});

it('returns an status when the data response is not in `waiting`', async (assert) => {
  dataResponses.safeFetch.returns({ status: 'queued' });
  const { status } = await enqueueDataResponse(2, '2', 2);
  assert.is(status, 'queued');
});

it('updates data response and launch addProcessDataResponseJob', async (assert) => {
  dataResponses.safeFetch.returns({ status: 'waiting' });
  await enqueueDataResponse(2, '2', 2);
  assert.true(dataResponses.update.called);
  assert.true(addProcessDataResponseJob.called);
});
