import { serial as it } from 'ava';
import {
  addTransactionJob,
  hasEnoughBatPayBalance,
  buyerAddress,
  batPayAddress,
} from './checkBatPayBalance.mock';
import { checkBatPayBalance, sendDeposit } from '../../src/recurrent/checkBatPayBalance';

it('checkBatPayBalance > issues an increase approval when there is not enough balance in BatPay', async (assert) => {
  await checkBatPayBalance();
  assert.snapshot(addTransactionJob.lastCall.args, { id: 'checkBatPayBalance > addTransactionJob().args' });
});

it('checkBatPayBalance > does not issue when there is balance in BatPay', async (assert) => {
  hasEnoughBatPayBalance.returns(true);
  await checkBatPayBalance();
  assert.false(addTransactionJob.called);
});

it('sendDeposit > issues a deposit', async (assert) => {
  await sendDeposit({ owner: buyerAddress, spender: batPayAddress, value: '500' });
  assert.snapshot(addTransactionJob.lastCall.args, { id: 'sendDeposit > addTransactionJob().args' });
});
