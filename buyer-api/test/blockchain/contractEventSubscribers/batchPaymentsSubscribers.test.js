import test from 'ava';
import { orderStats, orderIdTest, gasPriceTest, gasUsedTest } from './batchPaymentsSubscribers.mock';
import './contractEventSubscribers.mock';
import { updateBuyerStats } from '../../../src/blockchain/contractEventSubscribers/batchPaymentsSubscribers';

const it = test.serial;

const payIndex = 17;
const from = 16;
const totalNumberOfPayees = 40;

it('stores stats about order', async (assert) => {
  await updateBuyerStats({ payIndex, from, totalNumberOfPayees });
  const weiSpent = Number(gasPriceTest) * Number(gasUsedTest);
  assert.snapshot(await orderStats.update.lastCall.args, [
    Number(orderIdTest),
    [{
      ethSpent: weiSpent,
      amountOfPayees: Number(totalNumberOfPayees),
    }], [],
  ]);
});
