import test from 'ava';
import { getBuyerInfo, dataOrders, addTransactionJob } from './createDataOrder.mock';
import { createDataOrder } from '../../src/operations/createDataOrder';

const it = test.serial;
const someDataOrder = {
  price: 333,
  audience: { age: 42 },
  requestedData: ['geolocation'],
  buyerInfoId: 'someBuyerInfoId',
  buyerUrl: 'someBuyerUrl',
  notariesAddresses: ['0xNotaryA', '0xNotaryB'],
};

it('sets id and status', async (assert) => {
  const { id, status } = await createDataOrder(someDataOrder);
  assert.is(id, 'uuid');
  assert.is(status, 'creating');
});

it('adds 0x to termsHash if its missing', async (assert) => {
  getBuyerInfo.returns(Promise.resolve({ termsHash: 'SomeOtherHash' }));
  await createDataOrder(someDataOrder);
  assert.is(dataOrders.store.firstCall.args[1].termsAndConditionsHash, '0xSomeOtherHash');
  assert.is(addTransactionJob.firstCall.args[1].termsAndConditionsHash, '0xSomeOtherHash');
});

it('stores data order', async (assert) => {
  await createDataOrder(someDataOrder);
  assert.snapshot(dataOrders.store.lastCall.args);
});

it('stores the correct url /orders/:uuid/offchain-data', async (assert) => {
  await createDataOrder(someDataOrder);
  assert.is(
    dataOrders.store.lastCall.args[1].buyerUrl,
    'someBuyerUrl/orders/uuid/offchain-data',
  );
});

it('adds transaction job', async (assert) => {
  await createDataOrder(someDataOrder);
  assert.snapshot(addTransactionJob.lastCall.args);
});
