import test from 'ava';
import { dataOrders, fetchDataOrder, getAccount } from './contractEventSubscribers.mock';
import { createDataOrderUpdater, createCloseDataOrder } from '../../src/blockchain/contractEventSubscribers';

const it = test.serial;

const data = { owner: 'someOwner', orderId: 1 };

it('if owner diferents from account does not updates order status', async (assert) => {
  getAccount.returns({ address: 'someAccount' });
  await createCloseDataOrder(data);
  assert.false(dataOrders.update.called);
});

it('update data order status to closed', async (assert) => {
  getAccount.returns({ address: 'someOwner' });
  fetchDataOrder.returns({ buyerUrl: '/orders/2/offchain-data' });
  await createCloseDataOrder(data);
  assert.is(dataOrders.update.firstCall.args[1].status, 'closed');
});

it('if owner diferents from account does not updates order', async (assert) => {
  getAccount.returns({ address: 'someAccount' });
  await createDataOrderUpdater('created')(data, { transactionHash: 'somehash' });
  assert.false(dataOrders.store.called);
});

it('if data order status is closed it does not store order', async (assert) => {
  getAccount.returns({ address: 'someOwner' });
  fetchDataOrder.returns({ buyerUrl: '/orders/2/offchain-data' });
  dataOrders.fetch.returns({ status: 'closed' });
  await createDataOrderUpdater('created')(data, { transactionHash: 'somehash' });
  assert.false(dataOrders.store.called);
});

it('store data order', async (assert) => {
  getAccount.returns({ address: 'someOwner' });
  fetchDataOrder.returns({ buyerUrl: '/orders/2/offchain-data' });
  dataOrders.fetch.returns({ status: 'creating' });
  await createDataOrderUpdater('created')(data, { transactionHash: 'somehash' });
  assert.snapshot(dataOrders.store.firstCall.args, { id: 'dataOrders.store().args' });
});
