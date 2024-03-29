import test from 'ava';
import { orderStats, orderIdTest, gasPriceTest, gasUsedTest, fetchTxData, paymentsTransactionHashes, lockingKeyHash, notarizationsPerLockingKeyHash, notarizations, notarizationId, addDecryptJob } from './batchPaymentsSubscribers.mock';
import './contractEventSubscribers.mock';
import { updateBuyerStats, decryptSellerKeys } from '../../../src/blockchain/contractEventSubscribers/batchPaymentsSubscribers';

const it = test.serial;

const payIndex = 17;
const from = 16;
const totalNumberOfPayees = 40;
const transactionHash = '0x5652c79ef5de30593ace6c6b05e24fcf8885c4cebc28d73c7b19c21b883113d4';

it('stores stats about order', async (assert) => {
  await updateBuyerStats(
    { payIndex, from, totalNumberOfPayees },
    { transactionHash },
  );
  const weiSpent = Number(gasPriceTest) * Number(gasUsedTest);
  assert.snapshot(await orderStats.update.lastCall.args, [
    Number(orderIdTest),
    {
      ethSpent: weiSpent,
      amountOfPayees: Number(totalNumberOfPayees),
      paymentsRegistered: 1,
    }, { ethSpent: 0, amountOfPayees: 0, paymentsRegistered: 0 },
  ]);
});

it('does not store stats if payment was triggered by another buyer', async (assert) => {
  const notThisBuyer = 909;
  await updateBuyerStats(
    { payIndex, from: notThisBuyer, totalNumberOfPayees },
    { transactionHash },
  );
  assert.false(orderStats.update.called);
});

it('decryptSellerKeys > is handled', async (assert) => {
  const key = 'akey';
  const data = { key, payIndex };
  await decryptSellerKeys(data);
  assert.true(paymentsTransactionHashes.safeFetch.calledOnceWithExactly(payIndex, null));
  assert.true(fetchTxData.calledOnce);
  assert.true(notarizationsPerLockingKeyHash.fetch.calledOnceWithExactly(lockingKeyHash));
  assert.deepEqual(notarizations.update.firstCall.args, [notarizationId, { masterKey: key }]);
  assert.deepEqual(addDecryptJob.firstCall.args, [{ notarizationId }]);
});
