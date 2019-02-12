import { serial as it } from 'ava';
import { dataResponses, addProcessDataResponseJob } from './queueDataResponse.mock';
import { queueDataResponse } from '../../src/operations/queueDataResponse';

it('returns an error when the data response does not exist', async (assert) => {
  const { error, status } = await queueDataResponse(2, '2', 2);
  assert.is(status, undefined);
  assert.is(error, 'There\'s not a DataResponse whith the data provided');
});

it('returns an status when the data response is not in `waiting`', async (assert) => {
  dataResponses.safeFetch.returns({ status: 'queued' });
  const { status } = await queueDataResponse(2, '2', 2);
  assert.is(status, 'queued');
});

it('updates data response and launch addProcessDataResponseJob', async (assert) => {
  dataResponses.safeFetch.returns({ status: 'waiting' });
  await queueDataResponse(2, '2', 2);
  assert.true(dataResponses.update.called);
  assert.true(addProcessDataResponseJob.called);
});
