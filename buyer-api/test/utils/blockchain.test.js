import test from 'ava';
import { dxContract } from './blockchain.mock';
import { fetchDataExchangeEvents, fetchDataOrder } from '../../src/utils/blockchain';

const it = test.serial;

it('fetchDataExchangeEvents > gets all events', async (assert) => {
  const someDataExchangeEvents = [
    { blockNumber: 666 },
    { blockNumber: 7 },
    { blockNumber: 5 },
  ];
  dxContract.getPastEvents.resolves(someDataExchangeEvents);
  const events = await fetchDataExchangeEvents(666);
  assert.true(dxContract.getPastEvents.calledOnceWithExactly('allEvents', { fromBlock: 666 }));
  assert.deepEqual(events, someDataExchangeEvents);
});

it('fetchDataExchangeEvents > filters out unconfirmed events', async (assert) => {
  const someDataExchangeEvents = [
    { blockNumber: 0 },
    { blockNumber: 3 },
    { },
    { blockNumber: 7 },
    { blockNumber: null },
    { blockNumber: 5 },
    { blockNumber: 0 },
  ];
  dxContract.getPastEvents.resolves(someDataExchangeEvents);
  const events = await fetchDataExchangeEvents(777);
  assert.true(dxContract.getPastEvents.calledOnceWithExactly('allEvents', { fromBlock: 777 }));
  assert.deepEqual(events, [
    { blockNumber: 3 },
    { blockNumber: 7 },
    { blockNumber: 5 },
  ]);
});

it('fetchDataOrder > throws with invalid dxId', async (assert) => {
  await assert.throws(fetchDataOrder(-1));
  await assert.throws(fetchDataOrder(-666));
  await assert.throws(fetchDataOrder('someDxId'));
  await assert.throws(fetchDataOrder());
  await assert.throws(fetchDataOrder(NaN));
  await assert.throws(fetchDataOrder(null));
  await assert.throws(fetchDataOrder(undefined));
});

it('fetchDataOrder > cast types correctly', async (assert) => {
  dxContract.dataOrders.returns([
    'SOMe AddRESs With UpperCaSe LeTTErs',
    '{"someAudienceFilter":"WithStringValue"}',
    666e9.toString(),
    '["some-connector-id","some-other-id"]',
    '0xSomeTermsAndConditionsHash',
    'some-buyer-url',
    1548859901,
    undefined,
  ]);
  assert.snapshot(await fetchDataOrder(1));
});
