import test from 'ava';
import { dataOrders, addTransactionJob } from './closeDataOrder.mock';
import { closeDataOrder } from '../../src/operations/closeDataOrder';

const it = test.serial;
const someDataOrder = {
  dxId: 1,
  status: 'created',
};

it('sends transaction and changes status to "closing"', async (assert) => {
  await closeDataOrder(1, someDataOrder);
  assert.is(dataOrders.update.firstCall.args[1].status, 'closing');
  assert.snapshot(addTransactionJob.firstCall.args[1], { id: 'addTransactionJob().args' });
});
