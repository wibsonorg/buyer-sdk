import test from 'ava';
import { dataOrders, fetchDataOrder, getAccount } from './dataOrderSubscribers.mock';
import {
  onDataOrderCreated,
  onDataOrderClosed,
} from '../../../src/blockchain/contractEventSubscribers/dataOrderSubscribers';

const it = test.serial;

const data = { buyer: 'somebuyer', orderId: 1 };

it('does not update the order status when the buyer param is not the current account', async (assert) => {
  getAccount.returns({ address: 'someAccount' });
  await onDataOrderClosed(data);
  assert.false(dataOrders.update.called);
});

it('updates the order status to closed', async (assert) => {
  getAccount.returns({ address: 'somebuyer' });
  fetchDataOrder.returns({ buyerUrl: '/orders/2/offchain-data' });
  await onDataOrderClosed(data);
  assert.is(dataOrders.update.firstCall.args[1].status, 'closed');
});

it('does not update the order when the buyer param is not the current account ', async (assert) => {
  getAccount.returns({ address: 'someAccount' });
  await onDataOrderCreated(data, { transactionHash: 'somehash' });
  assert.false(dataOrders.store.called);
});

it('does not update the order when the order is already closed', async (assert) => {
  getAccount.returns({ address: 'somebuyer' });
  fetchDataOrder.returns({ buyerUrl: '/orders/2/offchain-data' });
  dataOrders.fetch.returns({ status: 'closed' });
  await onDataOrderCreated(data, { transactionHash: 'somehash' });
  assert.false(dataOrders.store.called);
});

it('stores the order', async (assert) => {
  getAccount.returns({ address: 'somebuyer' });
  fetchDataOrder.returns({ buyerUrl: '/orders/2/offchain-data' });
  dataOrders.fetch.returns({ status: 'creating' });
  await onDataOrderCreated(data, { transactionHash: 'somehash' });
  assert.snapshot(dataOrders.store.firstCall.args, { id: 'dataOrders.store().args' });
});
