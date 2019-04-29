import { serial as it } from 'ava';
import {
  addTransactionJob,
  hasEnoughBatPayBalance,
  hasBatPayEnoughTokenAllowance,
  buyerAddress,
  batPayAddress,
} from './checkBatPayBalance.mock';
import { checkBatPayBalance, sendDeposit } from '../../src/recurrent/checkBatPayBalance';

it('checkBatPayBalance > issues an increase approval when there is not enough allowance for BatPay', async (assert) => {
  await checkBatPayBalance();
  assert.snapshot(addTransactionJob.lastCall.args, { id: 'checkBatPayBalance > IncreaseApproval.args' });
});

it('checkBatPayBalance > issues a deposit when there is not enough balance in BatPay', async (assert) => {
  hasBatPayEnoughTokenAllowance.returns(true);
  await checkBatPayBalance();
  assert.snapshot(addTransactionJob.lastCall.args, { id: 'checkBatPayBalance > Deposit.args' });
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
