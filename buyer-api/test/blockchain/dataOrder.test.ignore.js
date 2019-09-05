import test from 'ava';
import {
  getAccount, fakeAccount,
  fetchDataOrder, fakeDataOrder,
  dataOrders,
} from './dataOrder.mock';
import { createDataOrderUpdapter } from '../../src/blockchain/dataOrder';

const it = test.serial;
const dataOrderUpdater = createDataOrderUpdapter('someState');

const fakeEventFromOtherBuyer = { owner: '0xSomeOtherBuyerAddress' };
it('only operates with DataOrders owned by this buyer', async (assert) => {
  await dataOrderUpdater(fakeEventFromOtherBuyer);
  assert.is(getAccount.callCount, 1);
  assert.is(fetchDataOrder.callCount, 0);
});
const fakeEvent = {
  owner: fakeAccount.address,
  orderId: 666,
};
it('fetches the DataOrder fromm DataExchange', async (assert) => {
  await dataOrderUpdater(fakeEvent);
  assert.true(fetchDataOrder.calledOnceWithExactly(666));
});
it('fetches the correct DataOrder fromm the store', async (assert) => {
  await dataOrderUpdater(fakeEvent);
  assert.true(dataOrders.fetch.calledOnceWithExactly(fakeDataOrder.id));
});
it('sets correct the status', async (assert) => {
  await dataOrderUpdater(fakeEvent);
  assert.deepEqual(dataOrders.store.lastCall.args, [fakeDataOrder.id, {
    ...fakeDataOrder,
    dxId: 666,
    status: 'created',
  }]);
});
