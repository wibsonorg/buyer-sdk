import test from 'ava';
import './batPaySubscribers.mock';
import './contractEventSubscribers.mock';
import { onPaymentUnlocked } from '../../../src/blockchain/contractEventSubscribers/batPayUnlockSubscribers';

const it = test.serial;

const data = { key: 'akey', payIndex: 1 };

it('onPaymentUnlocked > is handled', async (assert) => {
  await onPaymentUnlocked(data);
  assert.true(true, 'True is true');
});
