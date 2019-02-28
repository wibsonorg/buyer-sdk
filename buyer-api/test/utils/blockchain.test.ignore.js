import { serial as it } from 'ava';
import { dxContract } from './blockchain.mock';
// import { fetchDataExchangeEvents, fetchDataOrder } from '../../src/utils/blockchain';
const { fetchDataExchangeEvents, fetchDataOrder } = {};

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
  await assert.throwsAsync(fetchDataOrder(-1));
  await assert.throwsAsync(fetchDataOrder(-666));
  await assert.throwsAsync(fetchDataOrder('someDxId'));
  await assert.throwsAsync(fetchDataOrder());
  await assert.throwsAsync(fetchDataOrder(NaN));
  await assert.throwsAsync(fetchDataOrder(null));
  await assert.throwsAsync(fetchDataOrder(undefined));
});

it('fetchDataOrder > cast types correctly', async (assert) => {
  dxContract.dataOrders.returns({
    buyer: 'SOMe AddRESs With UpperCaSe LeTTErs',
    audience: '{"someAudienceFilter":"WithStringValue"}',
    price: 666e9.toString(),
    requestedData: '["some-connector-id","some-other-id"]',
    termsAndConditionsHash: '0xSomeTermsAndConditionsHash',
    buyerUrl: 'some-buyer-url',
    createdAt: 1548859901,
    closedAt: undefined,
  });
  assert.snapshot(await fetchDataOrder(1), { id: 'fetchDataOrder().returns' });
});
