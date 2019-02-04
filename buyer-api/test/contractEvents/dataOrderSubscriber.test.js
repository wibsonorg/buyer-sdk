import test from 'ava';
import {
  getAccount, fakeAccount,
  fetchDataOrder, fakeDataOrder,
  dataOrders,
} from './dataOrderSubscriber.mock';
import { dataOrderCacheSubscriber } from '../../src/contractEvents/dataOrderSubscriber';

const it = test.serial;

const fakeEventFromOtherBuyer = { owner: '0xSomeOtherBuyerAddress' };
it('DataOrderCreated > only operates with DataOrders owned by this buyer', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderCreated(fakeEventFromOtherBuyer);
  assert.is(getAccount.callCount, 1);
  assert.is(fetchDataOrder.callCount, 0);
});
it('DataOrderClosed > only operates with DataOrders owned by this buyer', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderClosed(fakeEventFromOtherBuyer);
  assert.is(getAccount.callCount, 1);
  assert.is(fetchDataOrder.callCount, 0);
});

const fakeEvent = {
  owner: fakeAccount.address,
  orderId: 666,
};

it('DataOrderCreated > fetches the DataOrder fromm DataExchange', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderCreated(fakeEvent);
  assert.true(fetchDataOrder.calledOnceWithExactly(666));
});
it('DataOrderClosed > fetches the DataOrder fromm DataExchange', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderClosed(fakeEvent);
  assert.true(fetchDataOrder.calledOnceWithExactly(666));
});

it('DataOrderCreated > fetches the correct DataOrder fromm the store', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderCreated(fakeEvent);
  assert.true(dataOrders.fetch.calledOnceWithExactly(fakeDataOrder.id));
});
it('DataOrderClosed > fetches the correct DataOrder fromm the store', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderClosed(fakeEvent);
  assert.true(dataOrders.fetch.calledOnceWithExactly(fakeDataOrder.id));
});

it('DataOrderCreated > sets the status to created', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderCreated(fakeEvent);
  assert.deepEqual(dataOrders.store.lastCall.args, [fakeDataOrder.id, {
    ...fakeDataOrder,
    dxId: 666,
    status: 'created',
  }]);
});
it('DataOrderClosed > sets the status to closed', async (assert) => {
  await dataOrderCacheSubscriber.DataOrderClosed(fakeEvent);
  assert.deepEqual(dataOrders.store.lastCall.args, [fakeDataOrder.id, {
    ...fakeDataOrder,
    dxId: 666,
    status: 'closed',
  }]);
});
