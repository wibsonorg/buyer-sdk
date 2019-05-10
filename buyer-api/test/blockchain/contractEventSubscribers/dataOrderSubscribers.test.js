import test from 'ava';
import { dataOrders, getAccount } from './dataOrderSubscribers.mock';
import './contractEventSubscribers.mock';
import {
  onDataOrderCreated,
  onDataOrderClosed,
} from '../../../src/blockchain/contractEventSubscribers/dataOrderSubscribers';

const it = test.serial;

const data = { buyer: 'somebuyer', orderId: 1 };
const tx = { transactionHash: 'somehash' };

it('does not update the order status when the buyer param is not the current account', async (assert) => {
  getAccount.resolves({ address: 'someAccount' });
  await onDataOrderClosed(data);
  assert.false(dataOrders.update.called);
});

it('updates the order status to closed', async (assert) => {
  getAccount.resolves({ address: 'somebuyer' });
  await onDataOrderClosed(data);
  assert.is(dataOrders.update.firstCall.args[1].status, 'closed');
});

it('does not update the order when the buyer param is not the current account ', async (assert) => {
  getAccount.resolves({ address: 'someAccount' });
  await onDataOrderCreated(data, tx);
  assert.false(dataOrders.store.called);
});

it('does not update the order when the order is already closed', async (assert) => {
  getAccount.resolves({ address: 'somebuyer' });
  dataOrders.fetch.resolves({ status: 'closed' });
  await onDataOrderCreated(data, tx);
  assert.false(dataOrders.store.called);
});

it('stores the order', async (assert) => {
  getAccount.resolves({ address: 'somebuyer' });
  dataOrders.fetch.resolves({ status: 'creating' });
  await onDataOrderCreated(data, tx);
  assert.snapshot(dataOrders.store.firstCall.args, { id: 'dataOrders.store().args' });
});
