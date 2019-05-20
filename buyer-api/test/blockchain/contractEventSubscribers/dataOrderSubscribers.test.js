import test from 'ava';
import { dataOrders, getAccount, fakeStoredDataOrder, fakeFetchedDataOrder } from './dataOrderSubscribers.mock';
import './contractEventSubscribers.mock';
import {
  onDataOrderCreated,
  onDataOrderClosed,
} from '../../../src/blockchain/contractEventSubscribers/dataOrderSubscribers';

const it = test.serial;

const data = { buyer: 'somebuyer', orderId: 1 };
const tx = { transactionHash: 'somehash' };

it('onDataOrderClosed > does not update the order when the buyer param is not the current account', async (assert) => {
  getAccount.resolves({ address: 'someAccount' });
  await onDataOrderClosed(data);
  assert.false(dataOrders.update.called);
});

it('onDataOrderClosed > updates the order status to closed', async (assert) => {
  getAccount.resolves({ address: 'somebuyer' });
  await onDataOrderClosed(data);
  assert.is(dataOrders.update.lastCall.args[1].status, 'closed');
});

it('onDataOrderCreated > does not update the order when the buyer param is not the current account ', async (assert) => {
  getAccount.resolves({ address: 'someAccount' });
  fakeStoredDataOrder.status = 'creating';
  await onDataOrderCreated(data, tx);
  assert.false(dataOrders.update.called);
});

it('onDataOrderCreated > does not update the order when the order is already closed', async (assert) => {
  getAccount.resolves({ address: 'somebuyer' });
  fakeStoredDataOrder.status = 'closed';
  await onDataOrderCreated(data, tx);
  assert.is(await dataOrders.update.lastCall.returnValue, undefined);
});

it('onDataOrderCreated > stores the order', async (assert) => {
  getAccount.resolves({ address: 'somebuyer' });
  fakeStoredDataOrder.status = 'creating';
  await onDataOrderCreated(data, tx);
  assert.is(dataOrders.update.lastCall.args[0], fakeFetchedDataOrder.id);
  assert.snapshot(await dataOrders.update.lastCall.returnValue, { id: 'dataOrders.update().returns' });
});
